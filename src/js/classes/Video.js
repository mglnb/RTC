class Video {
  constructor() {
    this.$box = document.querySelector('.video')
    this.$chatbox = document.querySelector('.chat__box')
    this.$local = document.querySelector('.video__box--local')
    this.$remote = document.querySelector('.video__box--remote')
    this.$userlist = document.querySelectorAll('.user_list__users li')
  }

  openVideoBox() {
    this.$box.classList.add('active')
    this.$chatbox.classList.add('video_active')
    this.$chatbox.scrollTop = this.$chatbox.scrollHeight
  }
  closeVideoBox() {
    this.$box.classList.remove('active')
    this.$chatbox.classList.remove('video_active')
    this.$chatbox.scrollTop = this.$chatbox.scrollHeight
  }

  addLocalStream(stream) {
    console.log('add local stream', stream)
    try {
      this.$local.srcObject = stream
    } catch (e) {
      this.$local.src = URL.createObjectURL(stream)
    }
  }
  addRemoteStream(stream) {
    console.log('add remote stream', stream)
    try {
      this.$remote.srcObject = stream
    } catch (e) {
      this.$remote.src = URL.createObjectURL(stream)
    }
  }
  init() {
  
  }
}

export default new Video()
