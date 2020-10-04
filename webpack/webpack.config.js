const path = require('path');
const { DefinePlugin } = require('webpack');

const { paths } = require('./config');

exports.styleLoader = [
  // styles
  {
    test: /\.s(c|a)ss$/,
    include: paths.src,
    use: [
      {
        loader: 'css-loader',
        options: {
          modules: {
            context: paths.src,
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
    include: paths.src,
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
  entry: path.resolve(paths.src, 'index.tsx'),
  resolve: {
    extensions: ['.js', '.ts', '.tsx', '.json'],
    alias: {
      '@styles': path.resolve(paths.src, 'styles'),
      '@hooks': path.resolve(paths.src, 'hooks'),
      '@assets': path.resolve(paths.src, 'assets')
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
            options: { transpileOnly: true, configFile: paths.tsconfig }
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
