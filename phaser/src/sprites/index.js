import 'phaser'

export class Mushroom extends Phaser.Sprite {
  constructor ({game, x, y, asset, cursors}) {
    super(game, x, y, asset)
    this.anchor.setTo(0.5)
    this.cursors = cursors
  }

  update () {
    this.angle += 1
  }
}

export class Player extends Phaser.Sprite {
  constructor ({game, x, y, asset}) {
    super(game, x, y, asset)
    this.anchor.setTo(0.5)
  }

  update () {

  }
}
