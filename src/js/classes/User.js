import Chat from './Chat'
import PeerConnection from './PeerConnection'
import Socket from './Socket'
import Video from './Video'
class User {
  constructor() {
    this.$userinput = document.getElementById('username')
    this.$userlist = document.querySelector('.user_list__users')
    this.$login = document.querySelector('.login')
    this.$user = ''
    this.$box = document.querySelector('.video')
    this.$chatbox = document.querySelector('.chat__box')
  }
  appendUser(array) {
    let users = array
    this.$userlist.innerHTML = ''
    users.forEach(value => {
      this.$userlist.insertAdjacentHTML('beforeend', `<li>${value.username}</li>`)
    })

    Object.entries(this.$userlist.children).forEach(li => {
      li[1].addEventListener('click', e => {
        localStorage.setItem('target', e.target.innerText)
        PeerConnection.connect(e.target.innerText)
        Video.openVideoBox()
      })
    })
  }
  bindEvents() {
    this.$userlist.children.forEach(li => {
      li.addEventListener('click', e => {
        localStorage.setItem('target', e.target.innerText)

        PeerConnection.connect(e.target.innerText)
        Video.openVideoBox()
      })
    })
  }
  init() {
    Chat.init(PeerConnection)
    Socket.init()

    this.$userinput.addEventListener('keypress', e => {
      let key = e.which || e.keyCode
      if (e.target.value === '') return
      if (key === 13) {
        Socket.socket.emit('login', e.target.value)
        sessionStorage.setItem('user', e.target.value)
        // Chat.setUser(e.target.value)
        // this.appendUser(e.target.value)

        this.$login.classList.remove('active')
      }
    })
  }
}

export default new User()
