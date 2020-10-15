const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const svgToMiniDataURI = require('mini-svg-data-uri');
const ManifestPlugin = require('webpack-manifest-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const { merge } = require('webpack-merge');

const { base, style_loader } = require('./webpack.config');
const { paths } = require('./config');

style_loader[0].use.unshift(MiniCssExtractPlugin.loader);
style_loader[1].use.unshift(MiniCssExtractPlugin.loader);

module.exports = merge(base, {
  mode: 'production',
  output: {
    path: paths.build,
    filename: '[name].js'
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'main.css'
    }),
    new CleanWebpackPlugin(),
    new ManifestPlugin({
      publicPath: paths.public
    }),
    new CopyPlugin({
      patterns: [{ from: 'template.ejs', to: '' }] // copy raw ejs into assets, will be manually parsed in extension
    })
  ],
  module: {
    rules: [
      ...style_loader,
      {
        test: /\.(mp4|webm|wav|mp3|m4a|aac|oga)$/,
        loader: 'url-loader',
        options: {
          limit: 8192,
          name: 'media/[name].[ext]'
        }
      },
      {
        test: /\.svg$/,
        use: [
          // load svg as react component
          '@svgr/webpack',
          {
            loader: 'url-loader',
            options: {
              limit: 8192,
              name: 'assets/[name].[hash:8].[ext]',
              generator: (content) => svgToMiniDataURI(content.toString())
            }
          }
        ]
      },
      {
        test: /\.(ico|jpg|jpeg|png|gif|eot|otf|webp|ttf|woff|woff2|cur|ani|pdf)$/,
        loader: 'file-loader',
        options: {
          name: 'assets/[name].[ext]'
        }
      }
    ]
  },
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        extractComments: false
      }),
      new OptimizeCSSAssetsPlugin()
    ],
    usedExports: true,
    splitChunks: {
      cacheGroups: {
        styles: {
          name: 'main',
          test: /\.(sass|s?css)$/,
          chunks: 'all',
          enforce: true
        }
      }
    }
  }
});
