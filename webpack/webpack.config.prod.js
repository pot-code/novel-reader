const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const svgToMiniDataURI = require('mini-svg-data-uri');
const ManifestPlugin = require('webpack-manifest-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const { merge } = require('webpack-merge');

const { baseConfig, styleLoader } = require('./webpack.config');
const { paths } = require('./config');

styleLoader[0].use.unshift({
  loader: MiniCssExtractPlugin.loader
});
styleLoader[1].use.unshift(MiniCssExtractPlugin.loader);

module.exports = merge(baseConfig, {
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
      ...styleLoader,
      {
        test: /\.(png|jpg|gif|webp)$/,
        loader: 'url-loader',
        options: {
          limit: 8192,
          name: 'img/[name].[ext]'
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
              name: 'img/[name].[ext]',
              generator: (content) => svgToMiniDataURI(content.toString())
            }
          }
        ]
      },
      {
        test: /\.(eot|ttf|woff|woff2)$/,
        loader: 'file-loader',
        options: {
          name: 'fonts/[name].[ext]'
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
