/* global require, module */

const { resolve } = require('app-root-path')
const { format } = require('url')

const isDev = require('electron-is-dev')

const windowURL = page => {
  if (page.indexOf('/') !== -1 || page.indexOf('\\') !== -1) {
    throw Error('You pesky hax0r!')
  }
  const devPath = `http://localhost:8000/${page}`
  let prodPath = format({
    pathname: resolve(`renderer/out/${page}/index.html`),
    protocol: 'file:',
    slashes: true
  })
  const url = isDev ? devPath : prodPath
  return url
}

module.exports = windowURL
