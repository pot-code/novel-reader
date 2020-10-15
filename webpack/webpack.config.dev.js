const WebpackBar = require('webpackbar');
const path = require('path');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const { HotModuleReplacementPlugin } = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const { base, style_loader } = require('./webpack.config');
const package = require('../package.json');
const { merge } = require('webpack-merge');
const { paths } = require('./config');

style_loader[0].use.unshift('style-loader');
style_loader[1].use.unshift('style-loader');

module.exports = merge(base, {
  mode: 'development',
  devtool: 'cheap-module-eval-source-map',
  plugins: [
    new ReactRefreshWebpackPlugin(),
    new HotModuleReplacementPlugin(),
    new WebpackBar({
      name: package.name,
      color: '#32e0c4'
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
      ...style_loader,
      {
        test: /\.(mp4|webm|wav|mp3|m4a|aac|oga)$/,
        loader: 'url-loader'
      },
      {
        test: /\.svg$/,
        use: ['@svgr/webpack', 'url-loader']
      },
      {
        test: /\.(ico|jpg|jpeg|png|gif|eot|otf|webp|ttf|woff|woff2|cur|ani|pdf)$/,
        loader: 'file-loader'
      }
    ]
  }
});
