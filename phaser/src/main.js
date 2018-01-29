import PIXI from 'expose-loader?PIXI!phaser-ce/build/custom/pixi.js';
import p2 from 'expose-loader?p2!phaser-ce/build/custom/p2.js';
import Phaser from 'expose-loader?Phaser!phaser-ce/build/custom/phaser-split.js';
const ASSETS = 'assets'
class Game {
    constructor () {
        this.game = new Phaser.Game(800, 600, Phaser.AUTO, '', {preload: this.preload, create: this.create, update: this.update, collectStar: this.collectStar})
        this.plataforms = null
        this.player = null
        this.cursors = null
        this.stars = null

    }

    preload () {
        this.game.load.image('sky', ASSETS + '/images/sky.png');
        this.game.load.image('ground', ASSETS + '/images/platform.png');
        this.game.load.image('star', ASSETS + '/images/star.png');
        this.game.load.spritesheet('dude', ASSETS + '/images/dude.png', 32, 48);
    }

    create () {
        this.game.physics.startSystem(Phaser.Physics.ARCADE)

        this.game.add.sprite(0, 0, 'sky')

        this.plataforms = this.game.add.group()

        this.plataforms.enableBody = true

        let ground = this.plataforms.create(0, this.game.world.height - 64, 'ground')

        ground.scale.setTo(2, 2)

        ground.body.immovable = true

        let ledge = this.plataforms.create(400, 400, 'ground')

        ledge.body.immovable = true

        ledge = this.plataforms.create(-150, 250, 'ground')

        ledge.body.immovable = true


        this.player = this.game.add.sprite(32, this.game.world.height - 150, 'dude')

        this.game.physics.arcade.enable(this.player)

        this.player.body.bounce.y = 0.2
        this.player.body.gravity.y = 300
        this.player.body.collideWorldBounds = true

        this.player.animations.add('left', [0, 1, 2, 3], 10, true)
        this.player.animations.add('right', [5, 6, 7, 8], 10, true)

        this.cursors = this.game.input.keyboard.createCursorKeys()

        // Stars

        this.stars = this.game.add.group()
        this.stars.enableBody = true

        for (let i = 0; i < 12; i++) {
            let star = this.stars.create(i * 70, 0, 'star')
            star.body.gravity.y = 6
            star.body.bounce.y = 0.7 + Math.random() * 0.2
        }

        // scoreText
        this.scoreText = this.game.add.text(16, 16, 'Score: 0', {fontSize: '32px', fill: '#393'})
    }

    update () {
        let hitPlataform = this.game.physics.arcade.collide(this.player, this.plataforms)
        this.game.physics.arcade.collide(this.stars, this.plataforms)
        this.player.body.velocity.x = 0
        if (this.cursors.left.isDown) {
            this.player.body.velocity.x = -150
            this.player.animations.play('left')
        } else if (this.cursors.right.isDown) {
            this.player.body.velocity.x = 150;
            this.player.animations.play('right')
        } else {
            this.player.animations.stop()
            this.player.frame = 4
        }
        this.game.physics.arcade.overlap(this.player, this.stars, this.collectStar, null, this)

        if (this.cursors.up.isDown && this.player.body.touching.down && hitPlataform) {
            this.player.body.velocity.y = -350
        }
    }
    collectStar (player, star) {
        star.kill()
    }
    init () {
    }
}

new Game().init()

// const GAME = new Phaser.Game(800, 600, Phaser.AUTO, CONTAINER);

// GAME.state.add('boot', Boot);
// GAME.state.add('preload', Preload);
// GAME.state.add('title', Title);

// GAME.state.start('boot');
