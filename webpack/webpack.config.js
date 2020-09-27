const path = require('path');
const { DefinePlugin } = require('webpack');

const { srcPath, rootPath } = require('./path');

exports.styleLoader = [
  // styles
  {
    test: /\.s(c|a)ss$/,
    include: srcPath,
    use: [
      {
        loader: 'css-loader',
        options: {
          modules: {
            context: srcPath,
            localIdentName: '[name]-[local]__[hash:base64:5]'
          },
          importLoaders: 2
        }
      },
      'postcss-loader',
      'sass-loader'
    ]
  },
  {
    test: /\.css$/,
    include: srcPath,
    use: [
      {
        loader: 'css-loader',
        options: {
          importLoaders: 1
        }
      },
      'postcss-loader'
    ]
  }
];

exports.baseConfig = {
  entry: path.resolve(srcPath, 'index.tsx'),
  resolve: {
    extensions: ['.js', '.ts', '.tsx', '.json'],
    alias: {
      // sync with tsconfig
      '@shared': path.resolve(rootPath, 'shared')
    }
  },
  module: {
    rules: [
      // source code
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        sideEffects: false,
        use: [
          {
            loader: 'babel-loader',
            options: {
              cacheDirectory: true,
              cacheCompression: false
            }
          },
          {
            loader: 'ts-loader',
            options: { transpileOnly: true, configFile: path.resolve(rootPath, 'webview', 'tsconfig.json') }
          }
        ]
      }
    ]
  },
  plugins: [
    new DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
    })
  ]
};
