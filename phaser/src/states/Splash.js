import 'phaser'
import {centerGameObjects} from '../utils'

export default class extends Phaser.State {
  init () {}

  preload () {
    this.loaderBg = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'loaderBg')
    this.loaderBar = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'loaderBar')
    centerGameObjects([this.loaderBg, this.loaderBar])

    this.load.setPreloadSprite(this.loaderBar)
    //
    // load your assets
    //
    this.load.image('mushroom', 'assets/images/mushroom2.png')
    this.load.image('bg', 'assets/images/sky.png')
    this.load.image('ground', 'assets/images/platform.png')
    this.load.spritesheet('player', 'assets/images/dude.png', 32, 48)
    this.load.image('star', 'assets/images/star.png')
  }

  create () {
    this.state.start('Game')
  }
}
