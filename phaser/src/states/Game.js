/* globals __DEV__ */
import 'phaser'
import 'phaser-ce'
import { Mushroom, Player } from '../sprites/'
import Socket from '../multiplayer/Socket'
import PeerConnection from '../multiplayer/PeerConnection'
export default class extends Phaser.State {
  init() { }
  preload() { }

  create() {
    this.players = []
    this.he = 'ngm'
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
    this.game.stage.disableVisibilityChange = true
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

    this.player = this.spawn({ x: 32, y: this.world.height - 150, id: 'Você' })

    Socket.socket.emit('login', {
      x: this.player.x,
      y: this.player.y
    })
    Socket.socket.on('dataChannelOpen', () => {
      this.dc = window.dc
      window.a = this
      PeerConnection.rtcDataChannelEvents(e => {
        try {
          let json = JSON.parse(e.data)
          switch (json.type) {
            case 'update':
              this.updatePosition(json)
              break
            case 'stop':
              this.players[this.he].animations.stop()
              this.players[this.he].frame = 5
              break
          }
        } catch (msg) {
          console.log(e.data)
        }
      })
      this.channel = true
    })
    Socket.socket.on('loginPlayer', (data) => {
      if (data.new) {
        this.playersList = data.users
        this.he = data.id
        this.players[data.id] = this.spawn(data)
        window.he = this.he
      } else {
        this.me = data.id
        window.me = this.me
        console.log(data.users)
        data.users.forEach(player => {
          if (player.id !== this.me) {
            this.players[player.id] = this.spawn(data)
            this.he = player.id
          }
        })
      }
    })

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

  update() {
    let hitPlataform = this.game.physics.arcade.collide(this.player, this.platform)
    this.game.physics.arcade.collide(this.players[this.he], this.platform)
    this.game.physics.arcade.collide(this.stars, this.platform)

    this.player.body.velocity.x = 0

    if (this.cursors.left.isDown) {
      this.player.body.velocity.x = -150
      this.player.animations.play('left')
      this.ultima = 2
      if (this.dc && this.dc.readyState === 'open') {
        this.send({
          type: 'update',
          x: this.player.x,
          y: this.player.y,
          frame: this.ultima
        })
      }
    } else if (this.cursors.right.isDown) {
      this.player.body.velocity.x = 150
      this.player.animations.play('right')

      this.ultima = 5
      if (this.dc && this.dc.readyState === 'open') {
        this.send({
          type: 'update',
          x: this.player.x,
          y: this.player.y,
          frame: this.ultima
        })
      }
    } else if (this.cursors.down.isDown) {
      this.ultima = 4
      if (this.dc && this.dc.readyState === 'open') {
        this.send({
          type: 'stop',
          x: this.player.x,
          y: this.player.y,
          frame: this.ultima
        })
      }
    } else {
      this.player.animations.stop()
      this.player.frame = this.ultima
      if (this.dc && this.dc.readyState === 'open') {
        this.send({
          type: 'stop',
          x: this.player.x,
          y: this.player.y,
          frame: this.ultima,
          stop: true
        })
      }
    }
    if (this.cursors.left.justUp || this.cursors.right.justUp || this.cursors.up.justUp) {
      if (this.dc && this.dc.readyState === 'open') {
        this.send({
          type: 'stop',
          x: this.player.x,
          y: this.player.y,
          frame: this.ultima,
          stop: true
        })
      }
    }
    if (this.dc && this.dc.readyState === 'open') {
      this.send({
        type: 'update',
        x: this.player.x,
        y: this.player.y,
        frame: 4
      })
    }

    if (this.cursors.up.isDown && this.player.body.touching.down && hitPlataform) {
      this.player.body.velocity.y = -400
    }
    this.physics.arcade.overlap(this.player, this.stars, (player, star) => {
      star.kill()
      // this.player.children[0].setText(this.he + ' Score: ' + this.score[this.he])
    }, null, this)
    if (this.score === 120) {
      this.finish = true
    }
  }

  render() {
    if (__DEV__) {
      this.game.debug.spriteInfo(this.player, 32, 32)
    }
  }
  spawn(data) {
    let player = new Player({
      game: this.game,
      x: data.x,
      y: data.y,
      asset: 'player'
    })

    this.add.existing(player)
    this.physics.arcade.enable(player)

    player.body.bounce.y = 0.0
    player.body.gravity.y = 300
    player.body.collideWorldBounds = true

    player.animations.add('left', [0, 1, 2, 3], 10, true)
    player.animations.add('right', [5, 6, 7, 8], 10, true)
    return player
  }

  updatePosition(data) {
    if (this.players[this.he].x > data.x) {
      this.players[this.he].animations.play('left')
    } else if (this.players[this.he].x < data.x) {
      this.players[this.he].animations.play('right')
    }
    if (data.stop) {
      this.players[this.he].animations.stop()
      this.players[this.he].frame = 4
    }
    this.players[this.he].x = data.x
    this.players[this.he].y = data.y

    this.physics.arcade.overlap(this.players[this.he], this.stars, (player, star) => {
      star.kill()
    }, null, this)
  }

  send(msg) {
    this.dc.forEach(dataChannel => {
      dataChannel.send(JSON.stringify(msg))
    })
  }
}
