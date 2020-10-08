const WebpackBar = require('webpackbar');
const path = require('path');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const { HotModuleReplacementPlugin } = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const { base, style_loader } = require('./webpack.config');
const package = require('../package.json');
const { merge } = require('webpack-merge');
const { paths } = require('./config');

style_loader[0].use.unshift({
  loader: 'style-loader'
});
style_loader[1].use.unshift('style-loader');

module.exports = merge(base, {
  entry: ['webpack-hot-middleware/client?path=__hmr', path.resolve(paths.src, 'index.tsx')],
  mode: 'development',
  output: {
    path: paths.build,
    filename: '[name].js'
  },
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
