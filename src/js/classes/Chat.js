import Socket from './Socket'

/**
 * @export
 * @class Chat
 */
class Chat {
  /**
   * Creates an instance of Chat.
   * @memberof Chat
   */
  constructor () {
    this.$chatbox = document.querySelector('.chat__msgs')
    this.$chatinput = document.getElementById('text')
    this.$user = document.getElementById(document.location.hash.substr(1))
  }
  /**
   * @param {Object} {username, message}
   * @memberof Chat
   */
  appendMsg ({username, message}) {
    let msg = `
    <div class="chat__msg">
      <img class="chat__msg--img" src="https://openclipart.org/image/2400px/svg_to_png/177482/ProfilePlaceholderSuit.png" alt="">
      <ul class="chat__msg--list">
        <li class="chat__msg--title">${username || 'Anonymous'}
          <span class="chat__msg--time">${new Date().getDate()}/${new Date().getMonth() + 1}/${new Date().getFullYear()} ${new Date().getHours()}:${new Date().getMinutes()}</span>
        </li>
        <li class="chat__msg--msg">${message}</li>
      </ul>
    </div>
    `
    this.$chatbox.insertAdjacentHTML('beforeend', msg)
    this.$chatbox.scrollTop = this.$chatbox.scrollHeight
  }
  /**
   * Inicializa o chat assim que der um enter
   * @memberof Chat
   */
  init () {
    this.$chatinput.addEventListener('keypress', e => {
      let key = e.which || e.keyCode
      if (e.target.value === '') return
      if (key === 13) {
        Socket.socket.emit('message', e.target.value)
        this.appendMsg({
          username: this.$user.innerText,
          message: e.target.value
        })
        e.target.value = ''
      }
    })
  }
}

export default new Chat()
