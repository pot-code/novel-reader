module.exports = {
  ident: 'postcss',
  plugins: [
    require('tailwindcss'),
    require('postcss-preset-env')({
      browsers: '> 1% and last 2 versions'
    })
  ]
};
