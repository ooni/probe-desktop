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

const getBinaryDirectory = (prefix = 'probe-cli') => {
  if (is.development || process.env.NODE_ENV === 'test') {
    if (is.macos) {
      return path.join(getResourcesDirectory(), `build/${prefix}/darwin_amd64`)
    }
    if (is.linux) {
      return path.join(getResourcesDirectory(), `build/${prefix}/linux_amd64`)
    }
    if (is.windows) {
      return path.join(getResourcesDirectory(), `build/${prefix}/windows_amd64`)
    }
    throw Error('Only macos and linux development is currently supported')
  }
  return path.join(getResourcesDirectory(), 'bin')
}

const getProbeBinaryPath = () => {
  const directoryPath = getBinaryDirectory()
  const suffix = getBinarySuffix()
  return path.join(directoryPath, 'ooniprobe' + suffix)
}

const getTorBinaryPath = () => {
  // We don't ship a tor binary on platforms other than macOS and windows, so we
  // return an empty path to indicate we should not override the OONI_TOR_BINARY
  // environment variable for setting the path
  if (!is.macos && !is.windows) {
    return ''
  }
  const directoryPath = getBinaryDirectory('tor')
  const suffix = getBinarySuffix()
  return path.join(directoryPath, 'tor' + suffix)
}

const getHomeDir = () => {
  const userDataPath = (electron.app || electron.remote.app).getPath('userData')
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
  'probeBinaryPath': getProbeBinaryPath(),
  'torBinaryPath': getTorBinaryPath(),
  'binaryDirectory': getBinaryDirectory(),
  'binarySuffix': getBinarySuffix(),
  'homeDir': getHomeDir(),
  'autorunHomeDir': getAutorunHomeDir(),
  'logFile': log.transports.file.getFile().path,
})

module.exports = {
  getProbeBinaryPath,
  getTorBinaryPath,
  getBinaryDirectory,
  getBinarySuffix,
  getHomeDir,
  getAutorunHomeDir,
  debugGetAllPaths
}
