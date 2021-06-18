// Useful issue on non-ascii path problems on windows:
// https://github.com/nodejs/node/issues/17586
const path = require('path')
const { is } = require('electron-util')
const electron = require('electron')
const log = require('electron-log')

const getBinarySuffix = () => (process.platform === 'win32' ? '.exe' : '')

const getResourcesDirectory = () => {
  if (is.development || process.env.NODE_ENV === 'test') {
    const rsrcPath = path.join(__dirname, '..', '..')
    log.debug('getResourcesDirectory', rsrcPath)
    return rsrcPath
  }

  const appPath = electron.app.getPath('exe')

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
  if (is.development || process.env.NODE_ENV === 'test') {
    if (is.macos) {
      return path.join(getResourcesDirectory(), 'build/probe-cli/darwin_amd64')
    }
    if (is.linux) {
      return path.join(getResourcesDirectory(), 'build/probe-cli/linux_amd64')
    }
    if (is.windows) {
      return path.join(getResourcesDirectory(), 'build/probe-cli/windows_amd64')
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

const getHomeDir = () => {
  const userDataPath = electron.app.getPath('userData')
  if (is.development || process.env.NODE_ENV === 'test') {
    return path.join(getResourcesDirectory(), 'ooni_home')
  }
  return path.join(userDataPath, 'ooni_home')
}

const getAutorunHomeDir = () => {
  const homeDir = getHomeDir()
  const autorunSuffix = 'autorun'
  return `${homeDir}_${autorunSuffix}`
}

const debugGetAllPaths = () => ({
  'binaryPath': getBinaryPath(),
  'binaryDirectory': getBinaryDirectory(),
  'binarySuffix': getBinarySuffix(),
  'homeDir': getHomeDir(),
  'autorunHomeDir': getAutorunHomeDir(),
  'logFile': log.transports.file.getFile().path,
})

module.exports = {
  getBinaryPath,
  getBinaryDirectory,
  getBinarySuffix,
  getHomeDir,
  getAutorunHomeDir,
  debugGetAllPaths
}
