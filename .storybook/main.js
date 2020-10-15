const { base } = require('../webpack/webpack.config');
const { paths, css_module } = require('../webpack/config');

module.exports = {
  webpackFinal: async (config) => {
    config.resolve.alias = { ...config.resolve.alias, ...base.resolve.alias };

    // override \.css$ loader
    config.module.rules.find((rule) => {
      if (!rule.loader) {
        return false;
      }
      const ls = rule.loader;
      return ls.search(/file\-loader/) !== -1;
    }).test = /\.(ico|jpg|jpeg|png|gif|eot|otf|webp|ttf|woff|woff2|cur|ani|pdf)(\?.*)?$/;

    config.module.rules.unshift({
      test: /\.svg$/,
      use: [
        '@svgr/webpack',
        {
          loader: 'url-loader',
          options: {
            esModule: false
          }
        }
      ]
    });
    config.module.rules.push({
      test: /\.s(c|a)ss$/,
      include: paths.src,
      use: [
        'style-loader',
        {
          loader: 'css-loader',
          options: {
            modules: {
              context: paths.src,
              localIdentName: css_module.pattern
            },
            importLoaders: 2
          }
        },
        'postcss-loader',
        'sass-loader'
      ]
    });
    // (function () {
    //   const { inspect } = require('util');
    //   console.log(
    //     inspect(config, {
    //       depth: 5
    //     })
    //   );
    //   process.exit(0);
    // })();
    return config;
  },
  stories: ['../src/webview/**/*.stories.mdx', '../src/webview/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: ['@storybook/addon-links', '@storybook/addon-essentials']
};
