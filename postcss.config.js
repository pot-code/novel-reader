// const purgecss = require('@fullhuman/postcss-purgecss')({
//   content: ['./webview/**/*.tsx'],
//   whitelist: ['html', 'body', ':global', /^:root.*/],
//   // rejected: true,
//   defaultExtractor: (content) => content.match(/[\w-/:]+(?<!:)/g) || []
// });

module.exports = {
  ident: 'postcss',
  plugins: [
    require('tailwindcss'),
    require('postcss-preset-env')({
      browsers: '> 1% and last 2 versions'
    })
  ]
};
