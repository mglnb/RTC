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
    this.$userinput.addEventListener('keypress', e => {
      let key = e.which || e.keyCode
      if (e.target.value === '') return
      if (key === 13) {
        console.log(e.target.value)
        sessionStorage.setItem('user', e.target.value + '')
        this.appendUser(e.target.value)
        this.$login.classList.remove('active')
      }
    })
  }
}

export default new User()
