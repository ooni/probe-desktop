/* global require, module, process, __dirname */

// Useful issue on non-ascii path problems on windows:
// https://github.com/nodejs/node/issues/17586
const path = require('path')
const { is } = require('electron-util')

const electron = require('electron')

const debug = require('debug')('ooniprobe-desktop.utils.binary')

const getBinarySuffix = () => (process.platform === 'win32' ? '.exe' : '')

const getResourcesDirectory = () => {
  // XXX only macos development is currently supported
  if (is.development) {
    const rsrcPath = path.join(__dirname, '..', '..')
    debug('💣 development mode', rsrcPath)
    return rsrcPath
  }

  const appPath = (electron.app || electron.remote.app).getPath('exe')

  if (is.macos) {
    return path.join(appPath, '../../Resources')
  }
  if (is.linux) {
    return path.join(path.dirname(appPath), './resources')
  }
  if (is.windows) {
    return path.join(path.dirname(appPath), './resources')
  }

  // Other platforms we should just use relative paths and hope
  // for the best
  return './resources'
}

const getBinaryDirectory = () => {
  if (is.development) {
    if (is.macos) {
      return path.join(getResourcesDirectory(), 'build/probe-cli/darwin_amd64')
    }
    if (is.linux) {
      return path.join(getResourcesDirectory(), 'build/probe-cli/linux_amd64')
    }
    throw Error('Only macos and linux development is currently supported')
  }
  return path.join(getResourcesDirectory(), 'bin')
}

const getBinaryPath = () => {
  const directoryPath = getBinaryDirectory()
  const suffix = getBinarySuffix()
  return path.join(directoryPath, 'ooniprobe' + suffix)
}

const getSSLCertFilePath = () => {
  if (is.development) {
    return path.join(getResourcesDirectory(), 'bin', 'cert.pem')
  }
  return path.join(getResourcesDirectory(), 'cert.pem')
}

const getHomeDir = () => {
  const userDataPath = (electron.app || electron.remote.app).getPath('userData')
  if (is.development) {
    return path.join(getResourcesDirectory(), 'ooni_home')
  }
  return path.join(userDataPath, 'ooni_home')
}

const debugGetAllPaths = () => ({
  'binaryPath': getBinaryPath(),
  'binaryDirectory': getBinaryDirectory(),
  'binarySuffix': getBinarySuffix(),
  'SSLCertFilePath': getSSLCertFilePath(),
  'homeDir': getHomeDir()
})

module.exports = {
  getBinaryPath,
  getBinaryDirectory,
  getBinarySuffix,
  getSSLCertFilePath,
  getHomeDir,
  debugGetAllPaths
}
