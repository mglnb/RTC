
class PeerConnection {
  constructor () {
    this.peerConnection = new RTCPeerConnection()
  }

  bindEvents () {
  }

  connect (e) {
    console.log(e)
    this.peerConnection.createOffer()
      .then(offer => this.localConnection.setLocalDescription(offer))
      // .then(() => this.remoteConnection.setRemoteDescription(this.localConnection.localDescription))
      // .then(() => this.remoteConnection.createAnswer())
      // .then(answer => this.remoteConnection.setLocalDescription(answer))
      // .then(() => this.localConnection.setRemoteDescription(this.remoteConnection.localDescription))
      // .catch(err => console.warn(err))
  }
}

export default new PeerConnection()
