import Chat from './Chat'
import DataChannel from './DataChannel'
class User {
  constructor() {
    this.$userinput = document.getElementById('username')
    this.$userlist = document.querySelector('.user_list__users')
    this.$login = document.querySelector('.login')
  }
  appendUser(text) {
    this.$userlist.insertAdjacentHTML('beforeend', `<li>${text}</li>`)
  }
  init() {
    Chat.init(DataChannel)
    DataChannel.bindEvents()
    if (localStorage.getItem('user')) {
      this.$login.classList.remove('active')
      this.appendUser(localStorage.getItem('user'))
      DataChannel.connect()
      return
    }

    this.$userinput.addEventListener('keypress', e => {
      let key = e.which || e.keyCode
      if (e.target.value === '') return
      if (key === 13) {
        Chat.setUser(e.target.value)
        this.appendUser(e.target.value)

        this.$login.classList.remove('active')
        window.localStorage.setItem('user', e.target.value + '')
      }
    })
  }
}

export default new User()
