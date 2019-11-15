/* global require, module */
const path = require('path')
const fs = require('fs-extra')
const log = require('electron-log')

const { getHomeDir } = require('./paths')

const OONI_CONFIG_PATH = path.join(getHomeDir(), 'config.json')

// Utility function to set an index of an object based on dot notation.
// Stolen from: https://stackoverflow.com/questions/6393943
const setIndex = (obj, is, value) => {
  if (typeof is == 'string') {
    return setIndex(obj, is.split('.'), value)
  } else if (is.length==1 && value !== undefined) {
    return obj[is[0]] = value
  } else if (is.length==0) {
    return obj
  } else {
    return setIndex(obj[is[0]], is.slice(1), value)
  }
}

const setConfig = async (optionKey, currentValue, newValue) => {
  const config = await getConfig()
  // XXX this is not really atomic. We should ensure atomicity by proxying this
  // via probe-cli.
  const currentOldValue = optionKey.split('.').reduce((o,i) => o[i], config)
  if (currentOldValue !== currentValue) {
    log.info('setConfig: config file path', OONI_CONFIG_PATH)
    log.error('setConfig: inconsistent config file', currentOldValue, currentValue)
    throw Error('inconsistent config file')
  }
  setIndex(config, optionKey, newValue)
  await fs.writeJson(OONI_CONFIG_PATH, config, {spaces: '  '})
}

const getConfig = async () => {
  const config = await fs.readJson(OONI_CONFIG_PATH)
  return config
}

module.exports = {
  getConfig,
  setConfig
}
