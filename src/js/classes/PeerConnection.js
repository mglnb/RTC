import Socket from './Socket'
import Video from './Video'
function promise(t) {
  return new Promise(resolve => {
    return setTimeout(resolve, t)
  })
}
class PeerConnection {
  constructor() {
    this.peerConnection = null
    this.userlist = document.querySelectorAll('.user_list__users li')
    this.receiver = ''
    this.peerConfig = {
      'iceServers': [{ 'urls': 'stun:stun.l.google.com:19302' }, {
        'urls': 'turn:192.158.29.39:3478?transport=udp',
        'credential': 'JZEOEt2V3Qb0y27GRntt2u2PAYA=',
        'username': '28224511:1379330808'
      }, {
        'urls': 'turn:192.158.29.39:3478?transport=tcp',
        'credential': 'JZEOEt2V3Qb0y27GRntt2u2PAYA=',
        'username': '28224511:1379330808'
      }]
    }
  }
  bindEvents() {
    Socket.socket.on('new-ice-candidate-client', data => {
      console.log(data)
      if (!data.ice || !this.peerConnection) return
      let ice = new RTCIceCandidate(data.ice)
      this.peerConnection.addIceCandidate(ice)
    })

    Socket.socket.on('messageRtcClient', data => {
      console.log(data.data.type)
      if (data.data.type === 'offer') {
        promise(0)
          .then(() => {
            this.peerConnection = new RTCPeerConnection()
          })
          .then(() => {
            this.bindRTCEvents()
          })
          .then(() => this.peerConnection.setRemoteDescription(data.data))
          .then(() => {
            Video.openVideoBox()
            navigator.mediaDevices.getUserMedia({ video: true, audio: true })
              .then(stream => {
                Video.addLocalStream(stream)
                Video.addRemoteStream(this.peerConnection.getRemoteStreams()[0])
                this.peerConnection.addStream(stream)
              })
              .then(() => this.peerConnection.createAnswer())
              .then(answer => {
                this.peerConnection.setLocalDescription(answer)
                let receiver = localStorage.getItem('target') || this.receiver

                Socket.socket.emit('messageRtc', {
                  type: 'video-answer',
                  data: answer,
                  username: receiver
                })
              }).catch(err => console.error(err))
          })
      } else {
        this.peerConnection.setRemoteDescription(data.data)
          .then(() => {
            Video.addRemoteStream(this.peerConnection.getRemoteStreams()[0])
          })
      }
    })
  }
  bindRTCEvents() {
    this.peerConnection.onsignalingstatechange = e => {
      console.log('signaling state change to', e.target.signalingState)
    }

    this.peerConnection.onicecandidate = e => {
      console.log('onicecandidate', e)
      let rtc = e.candidate
      let receiver = localStorage.getItem('target') || this.receiver
      Socket.socket.emit('new-ice-candidate', { ice: rtc, username: receiver })
    }

    this.peerConnection.onnegotiationneeded = e => {
      console.log('negotiation needed ', e)
      if (e.target.signalingState !== 'have-remote-offer') {
        this.peerConnection.createOffer()
          .then(offer => {
            this.peerConnection.setLocalDescription(offer)
            let receiver = localStorage.getItem('target') || this.receiver

            Socket.socket.emit('messageRtc', {
              type: 'video-offer',
              data: offer,
              username: receiver
            })
          })
      }
    }
  }
  connect(e) {
    this.receiver = e || localStorage.getItem('target')
    promise(0)
      .then(() => {
        this.peerConnection = new RTCPeerConnection(this.peerConfig)
        navigator.mediaDevices.getUserMedia({ audio: true, video: true })
          .then(stream => {
            this.peerConnection.addStream(stream)
            Video.addLocalStream(stream)
          })
          .then(() => {
            console.log(this.peerConnection.getLocalStreams())
          })
      })
      .then(() => {
        this.bindRTCEvents()
      })
      .catch(err => console.error(err))
  }
  init() {
    this.bindEvents()
  }
}

export default new PeerConnection()
