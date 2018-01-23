import {log} from '../helper'
/**
 * Classe que guarda os elementos de vídeo e faz a manipulação do mesmo
 * @export
 * @class Video
 */
class Video {
  /**
   * Cria uma instancia de Video
   * @memberof Video
   */
  constructor () {
    this.$box = document.querySelector('.video')
    this.$chatbox = document.querySelector('.chat__box')
    this.$local = document.querySelector('.video__box--local')
    this.$remote = document.querySelector('.video__box--remote')
    this.$userlist = document.querySelectorAll('.user_list__users li')
  }

  /**
   * Desce a div de video inteira
   * @memberof Video
   */
  openVideoBox () {
    this.$box.classList.add('active')
    this.$chatbox.classList.add('video_active')
    this.$chatbox.scrollTop = this.$chatbox.scrollHeight
  }

  /**
   * Sobe a div de video inteira
   * @memberof Video
   */
  closeVideoBox () {
    this.$box.classList.remove('active')
    this.$chatbox.classList.remove('video_active')
    this.$chatbox.scrollTop = this.$chatbox.scrollHeight
  }

  /**
   * Transforma a stream em uma URL para botar no video local
   * @param {MediaStream} stream
   * @memberof Video
   */
  addLocalStream (stream) {
    log(`Adicionado stream local: ${stream.id}`)
    try {
      this.$local.srcObject = stream
    } catch (e) {
      this.$local.src = URL.createObjectURL(stream)
    }
  }
  /**
   * Transforma a stream em uma URL para botar no video remoto
   * @param {MediaStream} stream
   * @memberof Video
   */
  addRemoteStream (stream) {
    log(`Adicionado stream remota: ${stream.id}`)
    try {
      this.$remote.srcObject = stream
    } catch (e) {
      this.$remote.src = URL.createObjectURL(stream)
    }
  }
}

export default new Video()
