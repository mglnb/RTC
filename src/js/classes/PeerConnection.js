import Socket from './Socket'
import Video from './Video'
import Chat from './Chat'
import { promise, log } from '../helper'
import { peerConfig } from '../config'

/**
 * Classe base para toda comunicação WebRTC
 * @export
 * @class PeerConnection
 */
class PeerConnection {
  /**
   * Cria uma instancia de PeerConnection
   */
  constructor() {
    this.peerConnection = null
    this.peerConfig = peerConfig
    this.receiver = ''
    this.caller = ''
    this.dataChannel = null
  }
  /**
   * Inicia a conexão de peer-to-peer
   * @param {String} receiver
   */
  connect(receiver) {
    document.querySelector('.user_list__title p').addEventListener('click', e => {
      this.dataChannel.send('teste')
    })

    this.caller = document.location.hash.substr(1)
    this.receiver = receiver || localStorage.getItem('target')
    promise(0)
      .then(() => (this.peerConnection = new RTCPeerConnection(this.peerConfig)))
      .then(() => (this.dataChannel = this.peerConnection.createDataChannel('dataChannel')))
      .then(() => this.getUserMedia())
      .then(() => this.bindEvents())
      .catch(err => log(err, 'error'))
  }
  /**
   * Solicita o uso da webcam e do microfone
   * addStream dispara o evento onnegotiationneeded com valor de have-local-offer
   * @param {String} type
   */
  getUserMedia(type = 'offer') {
    if (type === 'offer') {
      navigator.mediaDevices.getUserMedia({ audio: true, video: true })
        .then(stream => {
          this.peerConnection.addStream(stream)
          Video.addLocalStream(stream)
        })
      return
    }
    // se type for == answer
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then(stream => {
        Video.addLocalStream(stream)
        Video.addRemoteStream(this.peerConnection.getRemoteStreams()[0])
        log('addRemoteStream: ' + JSON.stringify(this.peerConnection.getRemoteStreams()), 'log', 'teal')
        this.peerConnection.addStream(stream) // dispara onnegociationneeded com valor de have-remote-offer
      })
      .then(() => this.peerConnection.createAnswer())
      .then(answer => {
        this.peerConnection.setLocalDescription(answer)
        Socket.socket.emit('messageRtc', {
          type: 'video-answer',
          data: answer,
          username: this.receiver || localStorage.getItem('target'),
          caller: this.caller
        })
      }).catch(err => log(err, 'error'))
  }

  bindEvents() {
    /**
     * Primeiro passo da comunicação.
     * Quando recebe a negociação com o valor have-local-offer
     * logo após o primeiro addStream
     */
    this.peerConnection.onnegotiationneeded = e => {
      log(`negotiation needed ${e.target.signalingState}`)
      if (e.target.signalingState !== 'have-remote-offer') {
        this.peerConnection.createOffer()
          .then(offer => {
            this.peerConnection.setLocalDescription(offer)
            Socket.socket.emit('messageRtc', {
              type: 'video-offer',
              data: offer,
              username: this.receiver || localStorage.getItem('target'),
              caller: this.caller
            })
          })
      }
    }
    /**
     * Estado do servidor
     */
    this.peerConnection.onsignalingstatechange = e => {
      log(`signaling state change to ${e.target.signalingState}`)
    }
    /**
     * Disparado quando o browsers precisa se comunicar com o outro
     */
    this.peerConnection.onicecandidate = e => {
      log(`onicecandidate ${JSON.stringify(e.candidate)}`)
      Socket.socket.emit('new-ice-candidate', {
        ice: e.candidate,
        username: this.receiver || localStorage.getItem('target'),
        caller: this.caller
      })
    }

    this.peerConnection.ondatachannel = e => {
      log('ondatachannel: ' + JSON.stringify(e.channel), 'log', 'purple')
      this.dataChannel = e.channel
      this.dataChannel.onmessage = event => {
        log('ondatachannelmessage: ' + JSON.stringify(event), 'log', 'purple')
        log('remoteStreams: ' + JSON.stringify(this.peerConnection.getRemoteStreams()), 'log', 'purple')
        Chat.appendMsg({
          username: 'teste',
          message: event.data
        })
      }
      this.dataChannel.onopen = e => {
        if (this.dataChannel.readyState === 'open') {
          log('Data Channel open')
        }
      }
    }
    if (this.dataChannel) {
      this.dataChannel.onopen = e => {
        if (this.dataChannel.readyState === 'open') {
          log('Data Channel open')
        }
      }
    }
  }
  /**
   * Sempre que for emitido o messageRtc, este método trata ele
   * @event messageRtc
   * @param {Object} data
   */
  messageRtcClient(data) {
    log(`messageRtcClient: ${data.data.type}`)
    this.caller = data.caller
    // Quando quem ligou recebe a resposta
    if (data.data.type === 'answer') {
      this.peerConnection.setRemoteDescription(data.data)
        .then(() => Video.addRemoteStream(this.peerConnection.getRemoteStreams()[0]))
        .then(() => log('addRemoteStream: ' + JSON.stringify(this.peerConnection.getRemoteStreams()), 'log', 'teal'))
        .catch(err => log(err, 'error'))
      return 
    }
    // Emitido para o usuário que está recebendo a ligação
    promise(0)
      .then(() => (this.peerConnection = new RTCPeerConnection(this.peerConfig)))
      .then(() => this.bindEvents())
      .then(() => this.peerConnection.setRemoteDescription(data.data))
      .then(() => Video.openVideoBox())
      .then(() => this.getUserMedia('answer'))
      .catch(err => log(err, 'error'))
  }
  /**
   * Comunicação ICE entre os browsers
   * @param {Object} data
   */
  iceCandidateClient(data) {
    log(`new-ice-candidate-client: ${JSON.stringify(data)}`)
    if (!data.ice || !this.peerConnection) return
    let ice = new RTCIceCandidate(data.ice)
    this.peerConnection.addIceCandidate(ice)
  }
  /**
   * Desliga a chamada
   */
  hangUp() {
    this.peerConnection = null
  }
}

export default new PeerConnection()
