import Socket from './Socket'
import Video from './Video'
import {promise, log} from '../helper'
import {peerConfig} from '../config'

/**
 * Classe base para toda comunicação WebRTC
 * @export
 * @class PeerConnection
 */
class PeerConnection {
  constructor () {
    this.peerConnection = null
    this.peerConfig = peerConfig
    this.receiver = ''
    this.caller = ''
  }
  bindEvents () {
    Socket.socket.on('messageRtcClient', data => {
      log(`messageRtcCliente: ${data.data.type}`)
      this.caller = data.caller
      if (data.data.type === 'answer') {
        this.peerConnection.setRemoteDescription(data.data)
          .then(() => Video.addRemoteStream(this.peerConnection.getRemoteStreams()[0]))
          .catch(err => log(err, 'error'))
        return
      }

      promise(0)
        .then(() => (this.peerConnection = new RTCPeerConnection()))
        .then(() => this.bindRTCEvents())
        .then(() => this.peerConnection.setRemoteDescription(data.data))
        .then(() => Video.openVideoBox())
        .then(() => this.getUserMedia('answer'))
        .catch(err => log(err, 'error'))
    })

    Socket.socket.on('new-ice-candidate-client', data => {
      log(`new-ice-candidate-client: ${JSON.stringify(data)}`)
      if (!data.ice || !this.peerConnection) return
      let ice = new RTCIceCandidate(data.ice)
      this.peerConnection.addIceCandidate(ice)
    })
  }
  getUserMedia (type = 'offer') {
    if (type === 'offer') {
      navigator.mediaDevices.getUserMedia({audio: true, video: true})
        .then(stream => {
          this.peerConnection.addStream(stream)
          Video.addLocalStream(stream)
        })
      return
    }

    navigator.mediaDevices.getUserMedia({video: true, audio: true})
      .then(stream => {
        Video.addLocalStream(stream)
        Video.addRemoteStream(this.peerConnection.getRemoteStreams()[0])
        this.peerConnection.addStream(stream)
      })
      .then(() => this.peerConnection.createAnswer())
      .then(answer => {
        this.peerConnection.setLocalDescription(answer)
        let caller = this.caller
        let receiver = localStorage.getItem('target')
        console.warn('answer', caller, receiver)
        Socket.socket.emit('messageRtc', {
          type: 'video-answer',
          data: answer,
          username: receiver,
          caller
        })
      }).catch(err => log(err, 'error'))
  }

  bindRTCEvents () {
    this.peerConnection.onsignalingstatechange = e => {
      log(`signaling state change to ${e.target.signalingState}`)
    }

    this.peerConnection.onicecandidate = e => {
      log(`onicecandidate ${JSON.stringify(e.candidate)}`)
      Socket.socket.emit('new-ice-candidate', {
        ice: e.candidate,
        username: this.receiver,
        caller: this.caller
      })
    }

    this.peerConnection.onnegotiationneeded = e => {
      log(`negotiation needed ${e.target.signalingState}`)
      if (e.target.signalingState !== 'have-remote-offer') {
        this.peerConnection.createOffer()
          .then(offer => {
            this.peerConnection.setLocalDescription(offer)

            Socket.socket.emit('messageRtc', {
              type: 'video-offer',
              data: offer,
              username: this.receiver,
              caller: this.caller
            })
          })
      }
    }
  }

  connect (e) {
    this.caller = document.location.hash.substr(1)
    this.receiver = e || localStorage.getItem('target')
    promise(0)
      .then(() => (this.peerConnection = new RTCPeerConnection(this.peerConfig)))
      .then(() => this.getUserMedia())
      .then(() => this.bindRTCEvents())
      .catch(err => log(err, 'error'))
  }

  init () {
    this.bindEvents()
  }
}

export default new PeerConnection()
