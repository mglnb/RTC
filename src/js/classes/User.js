import PeerConnection from './PeerConnection'
import Socket from './Socket'
import Video from './Video'

/**
 * Classe que guarda os elementos da lista de usuarios e faz a manipulação da mesma
 * @export
 * @class User
 */
class User {
  /**
   * Cria uma instancia de User.
   * @memberof User
   */
  constructor () {
    this.$userinput = document.getElementById('username') // Input do nome
    this.$userlist = document.querySelector('.user_list__users') // ul da div
    this.$login = document.querySelector('.login') // div que pede o nome
  }

  /**
   * Recebe o array com a lista de usuários logado
   * é atualizada toda vez que algum usuário novo entra
   * @event click em todos 'li' filhos para iniciar uma ligação de vídeo
   * @param {Array} array
   * @memberof User
   */
  appendUser (array) {
    this.$userlist.innerHTML = ''
    array.forEach(value => {
      this.$userlist.insertAdjacentHTML('beforeend', `<li id="${value.id}">${value.username}</li>`)
    })

    Object.entries(this.$userlist.children).forEach(li => {
      li[1].addEventListener('click', e => {
        localStorage.setItem('target', e.target.id)
        PeerConnection.connect(e.target.id)
        Video.openVideoBox()
      })
    })
  }

  /**
   * Faz o login do usuário, assim já inicializando a classe.
   * @memberof User
   */
  init () {
    this.$userinput.addEventListener('keypress', e => {
      let key = e.which || e.keyCode
      if (e.target.value === '') return
      if (key === 13) {
        Socket.socket.emit('login', e.target.value)
        this.$login.classList.remove('active')
      }
    })
  }
}

export default new User()
