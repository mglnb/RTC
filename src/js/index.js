import Video from './classes/Video'
import User from './classes/User'
import Socket from './classes/Socket'
Video.init()
User.init()
let startTime

document.getElementById('ping').addEventListener('click', e => {
  setInterval(function () {
    startTime = Date.now()
    console.warn('ping')
    Socket.socket.emit('ping')
  }, 2000)
})
Socket.socket.on('pong', function () {
  console.warn('latency pong', Date.now() - startTime)
})
