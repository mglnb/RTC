const webpack = require('webpack')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const autoPrefixer = require('autoprefixer')
const path = require('path')
const srcDir = path.join(__dirname, './src/')
const dstDir = path.join(__dirname, './build/')

module.exports = env => {
  const ifProd = plugin => (env.prod ? plugin : undefined)
  const isDev = plugin => (env.dev ? plugin : undefined)
  const removeEmpty = array => array.filter(p => !!p)

  const extractSass = new ExtractTextPlugin({
    filename: '[name].css',
    disable: false,
    allChunks: true
  })

  return {
    entry: {
      app: srcDir
    },
    output: {
      filename: '[name].js',
      path: dstDir
    },
    module: {
      loaders: [{
        test: /\.(js)$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      },
      {
        test: /\.s?css$/,
        use: extractSass.extract({
          use: [{
            loader: 'css-loader'
          },
          {
            loader: 'sass-loader'
          },
          {
            loader: 'postcss-loader',
            options: {
              plugins: [
                autoPrefixer()
              ]
            }
          }],
          fallback: 'style-loader'
        })
      }]
    },
    plugins: removeEmpty([
      new HtmlWebpackPlugin({
        template: path.join(__dirname, './src/index.html'),
        filename: 'index.html',
        inject: 'body'
      }),
      isDev(new webpack.HotModuleReplacementPlugin()),
      ifProd(
        new webpack.optimize.UglifyJsPlugin({
          compress: {
            screw_ie8: true,
            warnings: false,
            unused: false,
            dead_code: false
          },
          output: {
            comments: false
          },
          sourceMap: false
        })
      ),
      extractSass
    ]),
    devServer: {
      contentBase: srcDir,
      historyApiFallback: true,
      disableHostCheck: true,
      host: '10.70.130.111',
      hot: false,
      inline: true,
      port: 3000
    }
  }
}
