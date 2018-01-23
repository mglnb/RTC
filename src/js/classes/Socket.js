import io from 'socket.io-client'
import User from './User'
import Chat from './Chat'
import {log} from '../helper'
/**
 * Classe que inicializa os eventos dos sockets e faz a conexão.
 * @export
 * @class Socket
 */
class Socket {
  /**
   * Cria uma instancia de Socket e inicializa a conexão com o SocketIO.
   * @memberof Socket
   */
  constructor () {
    this.socket = io('https://mglrtc2.herokuapp.com/')
    this.userlist = []
  }

  /**
   * Inicializa todos os eventos necessários.
   * @memberof Socket
   */
  bindEvents () {
    // Disparado assim que entra no site
    this.socket.on('connect', () => {
      log('conectado')
    })

    // Disparado em toda mensagem enviada no chat
    this.socket.on('message', data => {
      Chat.appendMsg(data)
    })

    // Disparado quando o usuário faz login
    this.socket.on('makeLogin', data => {
      log(`Você entrou`)
      document.location.hash = `${data.id}`
      this.userlist = data.users
      User.appendUser(this.userlist)
    })

    // Disparado quando algum outro usuário entra no chat
    this.socket.on('userJoined', data => {
      log(`${data.username} fez login`)
      this.userlist.push({id: data.id, username: data.username})
      User.appendUser(this.userlist)
    })

    // Disparado quando o usuário sai do chat
    this.socket.on('userLeft', data => {
      log(`${data.username} saiu.`)
      this.userlist.splice(this.userlist.indexOf(data.username), 1)
      User.appendUser(this.userlist)
    })
  }

  /**
   * Inicializa a classe.
   * @memberof Socket
   */
  init () {
    this.bindEvents()
  }
}

export default new Socket()
