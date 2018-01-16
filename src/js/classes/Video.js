class Video {
  constructor() {
    this.$box = document.querySelector('.video')
    this.$chatbox = document.querySelector('.chat__box')
    this.$local = document.querySelector('.video__box--local')
    this.$remote = document.querySelector('.video__box--remote')
    this.$userlist = document.querySelectorAll('.user_list__users li')
  }

  init() {
    this.$userlist.forEach((value, index) => {
      value.addEventListener('click', e => {
        this.$box.classList.toggle('active')
        this.$chatbox.classList.toggle('video_active')
        this.$chatbox.scrollTop = this.$chatbox.scrollHeight
      })
    })
  }
}

export default new Video()
