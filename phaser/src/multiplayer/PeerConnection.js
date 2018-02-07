
import { promise, log } from '../../../src/js/helper'
import { peerConfig, connectionConfig, sdpConstraints } from './config'
import Socket from '../multiplayer/Socket'

class PeerConnection {
  constructor() {
    this.peerConnection = []
    this.dataChannel = []
  }

  rtcSetup(offer = true, id) {
    console.log('------------- id ', id)
    if (id) {
      this.peerConnection[id] = new RTCPeerConnection(peerConfig)
      this.dataChannel.push(this.peerConnection[id].createDataChannel('dataChannel'))
      this.rtcDataChannelEvents()
      this.rtcEvents(id)
    }
    window.peer = this.peerConnection
    window.dc = this.dataChannel
    window.p = this
  }

  rtcDataChannelEvents(cb) {
    this.dataChannel.forEach(dataChannel => {
      dataChannel.onmessage = cb
      dataChannel.onopen = e => {
        Socket.socket.emit('dataChannelOpened')
      }
      dataChannel.onclose = e => console.log(e, '--------- DC FECHADO! ----------')
      dataChannel.onerror = e => console.log(e, 'DataChannel error')
    })
    this.peerConnection.forEach(peer => {
      peer.ondatachannel = e => {
        console.log('peerConnection.ondatachannel event fired.')
        this.dataChannel.push(e.channel)
        this.rtcDataChannelEvents()
      }
    })
  }
  rtcEvents(me) {
    this.peerConnection[me].onicecandidate = e => {
      if (!this.peerConnection || !e || !e.candidate) return
      Socket.sendNegotiation('candidate', e.candidate)
    }
  }
  connect(he, me) {
    this.he = he
    this.me = me
    this.rtcSetup(true, me)
    this.peerConnection[me].createOffer(sdpConstraints)
      .then(offer => {
        this.peerConnection[me].setLocalDescription(offer)
        Socket.sendNegotiation('offer', offer)
        log('------ OFFER ------')
      })
  }

  handleIceCandidate(iceCandidate) {
    this.peerConnection[iceCandidate.to].addIceCandidate(iceCandidate.data)
  }

  handleAnswer(answer) {
    this.peerConnection[answer.to].setRemoteDescription(answer.data)
    log('------ ANSWER -------')
  }

  // Browser 2

  openDataChannel() {
    return promise(0).then(() => this.rtcSetup(false, this.me))
  }

  async handleOffer(offer) {
    this.me = offer.to
    await this.openDataChannel()
    this.peerConnection[offer.to].setRemoteDescription(new RTCSessionDescription(offer.data))
    this.peerConnection[offer.to].createAnswer(sdpConstraints)
      .then(answer => {
        this.peerConnection[offer.to].setLocalDescription(answer)
        Socket.sendNegotiation('answer', answer)
      })
  }
}

const peer = new PeerConnection()
export default peer
