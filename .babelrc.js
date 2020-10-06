const is_test_env = process.env.NODE_ENV === 'test';

module.exports = {
  presets: [
    '@babel/preset-typescript',
    '@babel/preset-react',
    [
      '@babel/preset-env',
      {
        targets: {
          browsers: ['> 1%', 'last 2 versions', 'not ie <= 8']
        }
      }
    ]
  ],
  plugins: [
    'react-hot-loader/babel',
    '@babel/plugin-syntax-dynamic-import',
    '@babel/plugin-proposal-class-properties',
    [
      '@babel/plugin-transform-runtime',
      {
        regenerator: true
      }
    ],
    [
      'react-css-modules',
      {
        // WARN: sync with frontend src path
        context: 'src/webview',
        generateScopedName: is_test_env ? '[local]' : '[name]-[local]__[hash:base64:5]',
        handleMissingStyleName: 'warn',
        webpackHotModuleReloading: true,
        filetypes: {
          '.scss': {
            syntax: 'postcss-scss'
          }
        }
      }
    ]
  ]
};
