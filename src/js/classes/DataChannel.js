class DataChannel {
  constructor() {
    this.localConnection = new RTCPeerConnection()

    this.remoteConnection = new RTCPeerConnection({
      'iceServers': [{
        urls: ['turn:173.194.72.127:19305?transport=udp',
          'turn:[2404:6800:4008:C01::7F]:19305?transport=udp',
          'turn:173.194.72.127:443?transport=tcp',
          'turn:[2404:6800:4008:C01::7F]:443?transport=tcp'
        ],
        username: 'CKjCuLwFEgahxNRjuTAYzc/s6OMT',
        credential: 'u1SQDR/SQsPQIxXNWQT7czc/G4c='
      },
      {
        urls: ['stun:stun.l.google.com:19302']
      }
      ]
    }, {
      optional: [{
        DtlsSrtpKeyAgreement: true
      }]
    })

    this.sendChannel = this.localConnection.createDataChannel('sendChannel', { reliable: true })
    this.receiveChannel = null
  }

  bindEvents() {
    this.sendChannel.onopen = () => {
      console.log('send channel', 'opened')
      if (this.sendChannel) {
        let state = this.sendChannel.readyState
        console.log('send channel state', state)
        if (state === 'open') {

        }
      }
    }

    this.sendChannel.onclose = () => {

    }

    this.remoteConnection.ondatachannel = (event) => {
      this.receiveChannel = event.channel

      this.receiveChannel.onmessage = (event) => {
        console.log(event.data)
      }
      this.receiveChannel.onopen = (event) => {
        console.log('receive channel open', 'changed to', this.receiveChannel.readyState)
      }
      this.receiveChannel.onclose = (event) => {
        console.log('receive channel close', 'changed to', this.receiveChannel.readyState)
      }
    }

    this.localConnection.onicecandidate = e => !e.candidate || this.remoteConnection.addIceCandidate(e.candidate).catch(console.log)
    this.remoteConnection.onicecandidate = e => !e.candidate || this.localConnection.addIceCandidate(e.candidate).catch(console.log)
  }

  sendMessage(message) {
    console.log('send message', message)
    this.sendChannel.send(message)
  }

  connect() {
    this.localConnection.createOffer()
      .then(offer => this.localConnection.setLocalDescription(offer))
      .then(() => this.remoteConnection.setRemoteDescription(this.localConnection.localDescription))
      .then(() => this.remoteConnection.createAnswer())
      .then(answer => this.remoteConnection.setLocalDescription(answer))
      .then(() => this.localConnection.setRemoteDescription(this.remoteConnection.localDescription))
      .catch(err => console.warn(err))
  }
}

export default new DataChannel()
