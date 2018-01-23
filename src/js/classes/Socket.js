import io from 'socket.io-client'
import User from './User'
import Chat from './Chat'
var socket = io('https://mglrtc2.herokuapp.com/')
class Socket {
  constructor () {
    this.socket = socket
    this.userlist = []
  }
  bindEvents () {
    this.socket.on('connect', () => {
      console.log('conectado')
    })
    this.socket.on('message', data => {
      Chat.appendMsg(data)
    })

    this.socket.on('makeLogin', data => {
      console.log('fez login', data)
      document.location.hash = `${data.id}`
      this.userlist = data.users
      User.appendUser(this.userlist)
    })

    this.socket.on('userJoined', data => {
      console.log('loguei', data)
      this.userlist.push({id: data.id, username: data.username})
      User.appendUser(this.userlist)
    })

    this.socket.on('userLeft', data => {
      console.log('userleft', data.username)
      this.userlist.splice(this.userlist.indexOf(data.username), 1)
      User.appendUser(this.userlist)
    })
  }

  init () {
    this.bindEvents()
  }
}

export default new Socket()
