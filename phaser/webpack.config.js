'use strict';

var path = require('path'),
    webpack = require('webpack'),
    WebpackStrip = require('webpack-strip');

var source = path.join(__dirname, 'src'),
    content = path.join(__dirname, 'static'),
    main = 'main.js',
    min = 'main.min.js',
    entry = path.join(source, main);


// Phaser webpack config
var phaserModule = path.join(__dirname, '/node_modules/phaser/');
var phaser = path.join(phaserModule, 'build/custom/phaser-split.js');
var pixi = path.join(phaserModule, 'build/custom/pixi.js');
var p2 = path.join(phaserModule, 'build/custom/p2.js');

module.exports = {
    entry: [
        entry,
        'webpack-dev-server/client?http://localhost:3032'
    ],

    output: {
        publicPath: '/',
        filename: min
    },

    debug: true,
    devtool: 'source-map',

    module: {
        loaders: [
            {
                test: /\.js$/,
                include: source,
                loader: 'babel-loader',
                query: {
                    presets: ['es2017']
                }
            },
            { test: /pixi\.js/, loader: 'expose?PIXI' },
            { test: /phaser-split\.js$/, loader: 'expose?Phaser' },
            { test: /p2\.js/, loader: 'expose?p2' },
            { test: /\.js$/, loader: WebpackStrip.loader(`import Phaser from 'phaser-ce'`) }
        ]
    },
    resolve: {
        alias: {
            'phaser': phaser,
            'pixi': pixi,
            'p2': p2,
          }
    },
    devServer: {
        contentBase: content,
        port: 3032
    }
}
