const WebpackBar = require('webpackbar');
const path = require('path');
const { HotModuleReplacementPlugin } = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
// const SpeedMeasurePlugin = require('speed-measure-webpack-plugin')

const { baseConfig, styleLoader } = require('./webpack.config');
const { merge } = require('webpack-merge');
const { paths } = require('./config');

styleLoader[0].use.unshift({
  loader: 'style-loader'
});
styleLoader[1].use.unshift('style-loader');

// const smp = new SpeedMeasurePlugin()
module.exports = merge(baseConfig, {
  entry: ['webpack-hot-middleware/client?path=__hmr', path.resolve(paths.src, 'index.tsx')],
  mode: 'development',
  resolve: {
    alias: {
      'react-dom': '@hot-loader/react-dom'
    }
  },
  output: {
    path: paths.build,
    filename: '[name].js'
  },
  devtool: 'cheap-module-eval-source-map',
  plugins: [
    new HotModuleReplacementPlugin(),
    new WebpackBar({
      color: '#75CA69'
    }),
    new HtmlWebpackPlugin({
      inject: true,
      template: paths.template
    })
  ],
  devServer: {
    contentBase: paths.public,
    quiet: true,
    open: false
  },
  module: {
    rules: [
      ...styleLoader,
      {
        test: /\.(png|jpg|gif)$/,
        loader: 'url-loader'
      },
      {
        test: /\.svg$/,
        use: ['@svgr/webpack', 'url-loader']
      },
      {
        test: /\.(eot|ttf|woff|woff2)$/,
        loader: 'file-loader'
      }
    ]
  }
});
