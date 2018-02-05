/* globals __DEV__ */
import 'phaser'
import {Mushroom, Player} from '../sprites/'
import Socket from '../multiplayer/Socket'
import PeerConnection from '../multiplayer/PeerConnection'

let dataChannel = PeerConnection.dataChannel
export default class extends Phaser.State {
  init () {}
  preload () {}

  create () {
    this.players = []
    this.physics.startSystem(Phaser.Physics.ARCADE)
    let bg = this.add.image(0, 0, 'bg')
    bg.width = window.innerWidth
    bg.height = window.innerHeight
    this.score = 0
    this.banner = this.add.text(this.world.right - 80, 30, 'Score: 0', {
      font: '40px Bangers',
      fill: '#77BFA3',
      smoothed: true
    })
    this.banner.anchor.setTo(0.5)
    this.game.stage.disableVisibilityChange = false
    this.platform = this.add.group()
    this.platform.enableBody = true
    let ground = this.platform.create(0, this.world.height - 32, 'ground')
    ground.body.immovable = true
    ground.width = 500

    ground = this.platform.create(500, 600, 'ground')
    ground.body.immovable = true
    ground.width = 400

    let ledge = this.platform.create(600, 400, 'ground')
    ledge.body.immovable = true

    ledge = this.platform.create(0, 300, 'ground')
    ledge.body.immovable = true

    this.player = new Player({
      game: this.game,
      x: 32,
      y: this.world.height - 150,
      asset: 'player'
    })

    Socket.socket.emit('login', {
      x: this.player.x,
      y: this.player.y
    }) 

    Socket.socket.on('loginPlayer', (data) => {
      this.players = data.users
      this.players[data.id] = this.spawn(data)
    })

    this.add.existing(this.player)
    this.physics.arcade.enable(this.player)

    this.player.body.bounce.y = 0.0
    this.player.body.gravity.y = 300
    this.player.body.collideWorldBounds = true

    this.player.animations.add('left', [0, 1, 2, 3], 10, true)
    this.player.animations.add('right', [5, 6, 7, 8], 10, true)
    this.cursors = this.input.keyboard.createCursorKeys()

    // Star

    this.stars = this.add.group()
    this.stars.enableBody = true

    for (let i = 0; i < 12; i++) {
      let star = this.stars.create(i * 70, 0, 'star')
      star.body.gravity.y = 300
      star.body.bounce.y = 0.3
    }
    this.ultima = 4
    this.finish = false
  }

  update () {
    let hitPlataform = this.game.physics.arcade.collide(this.player, this.platform)
    let hitStar = this.game.physics.arcade.collide(this.stars, this.platform)

    this.player.body.velocity.x = 0

    if (this.cursors.left.isDown) {
      this.player.body.velocity.x = -150
      this.player.animations.play('left')
      this.ultima = 2
    } else if (this.cursors.right.isDown) {
      this.player.body.velocity.x = 150
      this.player.animations.play('right')
      this.ultima = 5
    } else if (this.cursors.down.isDown) {
      this.ultima = 4
    } else {
      this.player.animations.stop()
      this.player.frame = this.ultima
    }

    if (this.cursors.up.isDown && this.player.body.touching.down && hitPlataform) {
      this.player.body.velocity.y = -400
    }
    this.physics.arcade.overlap(this.player, this.stars, (player, star) => {
      star.kill()
      this.score = this.score + 10
      this.banner.text = 'Score: ' + this.score
    }, null, this)
    if (this.score === 120) {
      this.finish = true
    }
  }

  render () {
    if (__DEV__) {
      this.game.debug.spriteInfo(this.player, 32, 32)
    }
  }
  spawn (data) {
    var p = this.game.add.sprite(data.x, data.y, 'player')
    p.animations.add('down', [0, 1, 2], 10)
    p.animations.add('left', [12, 13, 14], 10)
    p.animations.add('right', [24, 25, 26], 10)
    p.animations.add('up', [36, 37, 38], 10)
    return p
  }
}
