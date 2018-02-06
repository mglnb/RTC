
import {promise, log} from '../../../src/js/helper'
import {peerConfig, connectionConfig, sdpConstraints} from './config'
import Socket from '../multiplayer/Socket'

class PeerConnection {
  constructor () {
    this.peerConnection = null
    this.dataChannel = null
  }

  rtcSetup (offer = true) {
    this.peerConnection = new RTCPeerConnection(peerConfig)
    this.dataChannel = this.peerConnection.createDataChannel('dataChannel')
    this.rtcDataChannelEvents()
    this.rtcEvents()
    window.dc = this.dataChannel
  }

  rtcDataChannelEvents (cb) {
    this.dataChannel.onmessage = cb
    this.dataChannel.onopen = e => {
      Socket.socket.emit('dataChannelOpened')
    }
    this.dataChannel.onclose = e => console.log(e, '--------- DC FECHADO! ----------')
    this.dataChannel.onerror = e => console.log(e, 'DataChannel error')
    this.peerConnection.ondatachannel = e => {
      console.log('peerConnection.ondatachannel event fired.')
      this.dataChannel = e.channel
      this.rtcDataChannelEvents()
    }
  }
  rtcEvents () {
    this.peerConnection.onicecandidate = e => {
      if (!this.peerConnection || !e || !e.candidate) return
      Socket.sendNegotiation('candidate', e.candidate)
    }
  }
  connect () {
    this.rtcSetup()
    this.peerConnection.createOffer(sdpConstraints)
      .then(offer => {
        this.peerConnection.setLocalDescription(offer)
        Socket.sendNegotiation('offer', offer)
        log('------ OFFER ------')
      })
  }

  handleIceCandidate (iceCandidate) {
    this.peerConnection.addIceCandidate(iceCandidate)
  }

  handleAnswer (answer) {
    this.peerConnection.setRemoteDescription(answer)
    log('------ ANSWER -------')
  }

  // Browser 2

  openDataChannel () {
    return promise(0).then(() => this.rtcSetup(false))
  }

  async handleOffer (offer) {
    await this.openDataChannel()
    this.peerConnection.setRemoteDescription(new RTCSessionDescription(offer))
    this.peerConnection.createAnswer(sdpConstraints)
      .then(answer => {
        this.peerConnection.setLocalDescription(answer)
        Socket.sendNegotiation('answer', answer)
      })
  }
}

const peer = new PeerConnection()
export default peer
