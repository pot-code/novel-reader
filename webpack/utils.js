const { table, getBorderCharacters } = require('table')
const chalk = require('chalk')
const fs = require('fs')
const path = require('path')
const url = require('url')
const os = require('os')

const ASSETS_TABLE_HEADER = ['Asset', 'Size', 'Chunks', 'Chunk Names', 'Emitted'].map(text => chalk.gray.bold(text))

function to_network_table(addresses) {
  const table_config = {
    border: getBorderCharacters('void')
  }
  const body = [...addresses.map(address => [address.internal ? 'internal' : 'external', address.address])]

  return table(body, table_config)
}

function print_banner() {
  return new Promise((res, rej) => {
    const bannerSource = fs.createReadStream(path.resolve(__dirname, 'banner'), { autoClose: true })
    let str = ''

    bannerSource.on('data', chunk => {
      str += chunk
    })

    bannerSource.once('end', () => {
      console.log(chalk.green(str))
      res()
    })
  })
}

function get_network_address() {
  const interfaces = os.networkInterfaces()
  const addresses = []

  for (let interface in interfaces) {
    for (let address of interfaces[interface]) {
      if (address.family === 'IPv4') {
        addresses.push(address)
      }
    }
  }

  return addresses
}

function create_uri(protocol, hostname, port, pathname) {
  return url.format({
    protocol,
    hostname,
    port,
    pathname
  })
}

function once(fn) {
  let invoked = false

  return function(...args) {
    if (!invoked) {
      fn(...args)
      invoked = true
    }
  }
}

module.exports = {
  print_banner,
  create_uri,
  to_network_table,
  get_network_address,
  once
}
