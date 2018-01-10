const webpack = require('webpack')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const autoPrefixer = require('autoprefixer')
const path = require('path')
const srcDir = path.join(__dirname, './src/')
const dstDir = path.join(__dirname, './build/')

// Okay, this may be confusing at first glance but go through it step-by-step
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
    /**
     * entry tells webpack where to start looking.
     */
    entry: {
      app: srcDir
    },
    /**
     * output tells webpack where to put the files he creates
     * after running all its loaders and plugins.
     */
    output: {
      filename: '[name].js',
      path: dstDir
    },

    module: {
      // Loaders allow you to preprocess files!
      loaders: [{
        test: /\.(js)$/, // look for .js files
        exclude: /node_modules/, // ingore /node_modules
        loader: 'babel-loader' // preprocess with that babel goodness
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
      /**
       * HtmlWebpackPlugin will make sure out JavaScriot files are being called
       * from within our index.html
       */
      new HtmlWebpackPlugin({
        template: path.join(__dirname, './src/index.html'),
        filename: 'index.html',
        inject: 'body'
      }),

      isDev(new webpack.HotModuleReplacementPlugin()),

      // Only running UglifyJsPlugin() in production
      ifProd(
        new webpack.optimize.UglifyJsPlugin({
          compress: {
            screw_ie8: true,
            warnings: false,
            unused: true,
            dead_code: true
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
      hot: true,
      inline: true,
      port: 3000
    }
  }
}
