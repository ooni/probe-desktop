const fs = require('fs-extra')
const path = require('path')
const { is } = require('electron-util')

const { app } = require('electron')

const debug = require('debug')('ooniprobe-desktop.utils.binary')

const getBinarySuffix = () => (process.platform === 'win32' ? '.exe' : '')

const getResourcesDirectory = () => {
  // XXX only macos development is currently supported
  if (is.development) {
    const rsrcPath = path.join(__dirname, '..', '..')
    debug('💣 development mode', rsrcPath)
    return binPath
  }

  const appPath = app.getPath('exe')

  if (is.macos) {
    return path.join(appPath, '../../Resources');
  }
  if (is.linux) {
    return path.join(path.dirname(appPath), './resources')
  }
  // On windows and other platforms we should just use relative paths and hope
  // for the best
  if (is.windows) {
    return './resources'
  }
  return './resources'
}

const getBinaryDirectory = () => {
  // XXX only macos development is currently supported
  if (is.development) {
    return path.join(getResourcesDirectory(), 'bin/mac_x64')
  }
  return path.join(getResourcesDirectory(), 'bin')
}

const getBinaryPath = () => {
  const directoryPath = getBinaryDirectory()
  const suffix = getBinarySuffix()
  return path.join(directoryPath, 'ooni' + suffix)
}

const getSSLCertFilePath = () => {
  return path.join(getResourcesDirectory(), 'cert.pem')
}

module.exports = {
  getBinaryPath,
  getBinaryDirectory,
  getBinarySuffix
}
