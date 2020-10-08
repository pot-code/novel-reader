const is_test_env = process.env.NODE_ENV === 'test';
const is_dev_env = process.env.NODE_ENV === 'development';

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
    ...[is_dev_env && 'react-refresh/babel'].filter(Boolean),
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
