const fs = require('fs-extra')
const path = require('path')
const isDev = require('electron-is-dev')

const { app } = require('electron')

const debug = require('debug')('ooniprobe-desktop.utils.binary')

const getBinarySuffix = () => (process.platform === 'win32' ? '.exe' : '')

const getResourcesDirectory = () => {
  // XXX only macos development is currently supported
  if (isDev) {
    const rsrcPath = path.join(__dirname, '..', '..')
    debug('isDev', rsrcPath)
    return binPath
  }

  const appPath = app.getPath('exe')

  if (process.platform === 'darwin') {
    return path.join(appPath, '../../Resources');
  }
  if (process.platform === 'linux') {
    return path.join(path.dirname(appPath), './resources')
  }
  // On windows and other platforms we should just use relative paths and hope
  // for the best
  return './resources'
}

const getBinaryDirectory = () => {
  // XXX only macos development is currently supported
  if (isDev) {
    return path.join(getResourcesDirectory(), 'bin/mac_x64')
  }
  return path.join(getResourcesDirectory(), 'bin/mac_x64')
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
