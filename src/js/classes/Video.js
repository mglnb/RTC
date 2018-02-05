import { log } from '../helper'
import PeerConnection from './PeerConnection'
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
  constructor() {
    this.$box = document.querySelector('.video')
    this.$chatbox = document.querySelector('.chat__box')
    this.$videobox = document.querySelector('.video__box')
    this.$local = document.querySelector('.video__box--local')
    this.$remote = document.querySelector('.video__box--remote')
    this.$userlist = document.querySelectorAll('.user_list__users li')
    this.$hangup = document.querySelector('.video__btn--hangup')
  }

  /**
   * Desce a div de video inteira
   * @memberof Video
   */
  openVideoBox() {
    this.$box.classList.add('active')
    this.$chatbox.classList.add('video_active')
    this.$chatbox.scrollTop = this.$chatbox.scrollHeight
  }

  /**
   * Remove a div de vídeo desligando a chamada
   * @memberof Video
   */
  closeVideoBox() {
    this.$box.classList.remove('active')
    this.$chatbox.classList.remove('video_active')
    this.$chatbox.scrollTop = this.$chatbox.scrollHeight
    this.$local.src = null
    this.$local.srcObject = null
    this.$remote.src = null
    this.$remote.srcObject = null
  }

  /**
   * Transforma a stream em uma URL para botar no video local
   * @param {MediaStream} stream
   * @memberof Video
   */
  addLocalStream(stream) {
    log(`Adicionado stream local: ${(stream && stream.id) || 'sem stream'}`)
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
  addRemoteStream(stream) {
    log(`Adicionado stream remota: ${(stream && stream.id) || 'sem stream'}`)
    let clone = this.$remote.cloneNode()
    clone.style.display = 'inline'
    try {
      clone.srcObject = stream
    } catch (e) {
      clone.src = URL.createObjectURL(stream)
    }
    this.$videobox.appendChild(clone)
  }
  init() {
    this.$hangup.addEventListener('click', e => {
      PeerConnection.hangUp()
      this.closeVideoBox()
    })
  }
}

export default new Video()
