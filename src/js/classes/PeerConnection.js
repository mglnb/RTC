import Socket from './Socket'
function promise(t) {
  return new Promise(resolve => {
    return setTimeout(resolve, t)
  })
}
class PeerConnection {
  constructor() {
    this.peerConnection = null
    this.userlist = document.querySelectorAll('.user_list__users li')
  }
  bindEvents() {
    Socket.socket.on('messageRtcClient', data => {
      console.log(data)
      if (data.data.type === 'offer') {
        promise(0)
          .then(() => {
            this.peerConnection = new RTCPeerConnection()
          })
          .then(() => {
            console.log(this.peerConnection)
            this.bindRTCEvents()
          })
          .then(() => this.peerConnection.setRemoteDescription(data.data))
          .then(() => this.peerConnection.createAnswer())
          .then(answer => {
            this.peerConnection.setLocalDescription(answer)
            Socket.socket.emit('messageRtc', {
              type: 'video-answer',
              data: answer
            })
          }).catch(err => console.error(err))
      } else {
        this.peerConnection.setRemoteDescription(data.data)
      }
    })
  }
  bindRTCEvents() {
    this.peerConnection.onsignalingstatechange = e => {
      console.log('signaling state change', e)
    }
    this.peerConnection.onnegotiationneeded = e => {
      console.log('negotiation needed', e)
    }
  }
  connect(e) {
    console.log(e)
    promise(0)
      .then(() => {
        this.peerConnection = new RTCPeerConnection({
          'iceServers': [
            {
              'urls': 'stun:stun.l.google.com:19302'
            },
            {
              'urls': 'turn:192.158.29.39:3478?transport=udp',
              'credential': 'JZEOEt2V3Qb0y27GRntt2u2PAYA=',
              'username': '28224511:1379330808'
            },
            {
              'urls': 'turn:192.158.29.39:3478?transport=tcp',
              'credential': 'JZEOEt2V3Qb0y27GRntt2u2PAYA=',
              'username': '28224511:1379330808'
            }
          ]
        })
      })
      .then(() => {
        this.bindRTCEvents()
      })
      .then(() => {
        this.peerConnection.createOffer()
          .then(offer => {
            console.log(offer)
            this.peerConnection.setLocalDescription(offer)
            Socket.socket.emit('messageRtc', {
              target: e.target.innerText,
              type: 'video-offer',
              data: offer
            })
          })
      }).catch(err => console.error(err))
  }
  init() {
    this.bindEvents()
  }
}

export default new PeerConnection()
