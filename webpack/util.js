const { table, getBorderCharacters } = require('table');
const { cyanBright } = require('chalk');
const fs = require('fs');
const path = require('path');
const url = require('url');
const os = require('os');

function to_network_table(addresses) {
  const table_config = {
    border: getBorderCharacters('void')
  };
  const body = [...addresses.map((address) => [address.internal ? 'internal' : 'external', address.address])];

  return table(body, table_config);
}

function print_banner() {
  const content = fs.readFileSync(path.resolve(__dirname, 'banner')).toString();
  console.log(cyanBright(content));
}

function get_network_address() {
  const interfaces = os.networkInterfaces();
  const addresses = [];

  for (let interface in interfaces) {
    for (let address of interfaces[interface]) {
      if (address.family === 'IPv4') {
        addresses.push(address);
      }
    }
  }

  return addresses;
}

function create_uri(protocol, hostname, port, pathname) {
  return url.format({
    protocol,
    hostname,
    port,
    pathname
  });
}

function once(fn) {
  let invoked = false;

  return function (...args) {
    if (!invoked) {
      fn(...args);
      invoked = true;
    }
  };
}

function get_typeof_string(val) {
  return Object.prototype.toString.call(val);
}

module.exports = {
  print_banner,
  create_uri,
  to_network_table,
  get_network_address,
  get_typeof_string,
  once
};
