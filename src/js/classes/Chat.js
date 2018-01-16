class Chat {
  constructor() {
    this.msg = {
      sender: sessionStorage.getItem('user') || '',
      msgs: []
    }
    this.$chatbox = document.querySelector('.chat__msgs')
    this.$chatinput = document.getElementById('text')
  }

  appendMsg(text) {
    let msg = `
    <div class="chat__msg">
      <img class="chat__msg--img" src="https://openclipart.org/image/2400px/svg_to_png/177482/ProfilePlaceholderSuit.png" alt="">
      <ul class="chat__msg--list">
        <li class="chat__msg--title">${this.msg.sender || 'MglNB'}
          <span class="chat__msg--time">${new Date().getDate()}/${new Date().getMonth() + 1}/${new Date().getFullYear()} ${new Date().getHours()}:${new Date().getMinutes()}</span>
        </li>
        <li class="chat__msg--msg">${text}</li>
      </ul>
    </div>
    `

    this.$chatbox.insertAdjacentHTML('beforeend', msg)
    this.$chatbox.scrollTop = this.$chatbox.scrollHeight
  }

  init() {
    this.$chatinput.addEventListener('keypress', e => {
      let key = e.which || e.keyCode
      if (e.target.value === '') return
      if (key === 13) {
        this.appendMsg(e.target.value)
        e.target.value = ''
      }
    })
  }
}

export default new Chat()
