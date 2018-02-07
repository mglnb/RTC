import io from 'socket.io-client'
import PeerConnection from './PeerConnection'
import {log} from '../../../src/js/helper'
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
    this.socket = io('http://localhost:3030/')
    this.me = ''
    this.to = ''
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

    // Disparado quando o usuário faz login
    this.socket.on('makeLogin', data => {
      log(`Você entrou`)
      this.me = data.id
      this.to = data.users[0].id
      this.userlist = data.users
    })

    // Disparado quando algum outro usuário entra no chat
    this.socket.on('userJoined', data => {
      log(`${data.username} fez login`)
      this.to = data.id
      PeerConnection.connect(data.id, this.me)
    })

    // Disparado quando o usuário sai do chat
    this.socket.on('userLeft', data => {
      log(`${data.username} saiu.`)
      this.userlist.splice(this.userlist.indexOf(data.username), 1)
    })

    this.socket.on('message', data => {
      if (data.action === 'candidate') {
        if (data.to === this.me) {
          PeerConnection.handleIceCandidate(data)
        }
      } else if (data.action === 'offer') {
        if (data.to === this.me) {
          PeerConnection.handleOffer(data)
        }
      } else if (data.action === 'answer') {
        if (data.to === this.me) {
          PeerConnection.handleAnswer(data)
        }
      }
    })
  }

  sendNegotiation (type, sdp) {
    let json = {from: this.me, to: this.to, action: type, data: sdp}
    this.socket.emit('message', json)
    log(`Enviando de ${json.from} para ${json.to}, ${type}`)
    console.log(this.userlist)
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
