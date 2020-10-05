const express = require('express');
const webpack = require('webpack');
const devMiddleware = require('webpack-dev-middleware');
const hotMiddleware = require('webpack-hot-middleware');
const portfinder = require('portfinder');
const chalk = require('chalk');
const boxen = require('boxen');
const { stripIndent } = require('common-tags');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
const config = require('./webpack.config.dev');
const { print_banner, create_uri, to_network_table, get_network_address } = require('./util');

const DEFAULT_PORT = 8080;
const publicPath = config.devServer.publicPath || '/';
const compiler = webpack(config);
const proxy = config.devServer.proxy;

portfinder.basePort = config.devServer.port || DEFAULT_PORT;

if (proxy) {
  let proxyType = typeofString(proxy);
  if (proxyType === '[object Object]') {
    Object.keys(proxy).forEach((path) => {
      const value = proxy[path];
      if (typeofString(value) === '[object Object]') {
        app.use(path, createProxyMiddleware(value));
      } else {
        app.use(path, createProxyMiddleware({ target: value }));
      }
    });
  } else if (proxyType === '[object Array]') {
    proxy.forEach((item) => {
      const { context, ...rest } = item;
      const contextType = typeofString(context);
      if (contextType === '[object Array]') {
        context.forEach((path) => {
          app.use(path, createProxyMiddleware({ ...rest }));
        });
      } else {
        app.use(context, createProxyMiddleware({ ...rest }));
      }
    });
  } else {
    console.error('unsupported proxy config type:', proxyType);
  }
}

app.use(
  devMiddleware(compiler, {
    publicPath,
    logLevel: 'error',
    methods: ['GET', 'HEAD', 'POST', 'PUT'],
    watchOptions: {
      aggregateTimeout: 600
    }
  })
);
app.use(
  hotMiddleware(compiler, {
    log: false,
    path: '/__hmr'
  })
);

function typeofString(val) {
  return Object.prototype.toString.call(val);
}

async function start_server() {
  await print_banner();

  const port = await portfinder.getPortPromise();
  const addresses = get_network_address();
  const urls = addresses.map((address) => ({
    ...address,
    address: chalk.cyan(create_uri('http', address.address, port, publicPath))
  }));

  app.listen(port, () => {
    console.log(
      boxen(stripIndent` ${chalk.green('Dev server started')}\n\n${to_network_table(urls)} `, {
        borderColor: 'blueBright',
        padding: 1,
        borderStyle: 'double'
      })
    );
  });
}

start_server();
