const fs = require('fs-extra')
const path = require('path')
const isDev = require('electron-is-dev')

const { app } = require('electron')

const debug = require('debug')('ooniprobe-desktop.utils.binary')

const getBinarySuffix = () => (process.platform === 'win32' ? '.exe' : '')

const getBinaryDirectory = () => {
  // XXX only macos development is currently supported
  if (isDev) {
    const binPath = path.join(__dirname, '..', '..', './bin/mac_x64')
    debug('isDev', binPath)
    return binPath
  }

  const appPath = app.getPath('exe')

  if (process.platform === 'darwin') {
    return path.join(appPath, '../../Resources/bin');
  }
  if (process.platform === 'linux') {
    return path.join(path.dirname(appPath), './resources/bin')
  }
  // On windows and other platforms we should just use relative paths and hope
  // for the best
  return './resources/bin'
}

const getBinaryPath = () => {
  const directoryPath = getBinaryDirectory()
  const suffix = getBinarySuffix()
  return path.join(directoryPath, 'ooni' + suffix)
}
module.exports = {
  getBinaryPath,
  getBinaryDirectory,
  getBinarySuffix
}
