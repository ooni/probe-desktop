/* global require, module */
const path = require('path')
const fs = require('fs-extra')
const log = require('electron-log')

const { getHomeDir } = require('./paths')

const LATEST_CONFIG_VERSION = 2

const OONI_CONFIG_PATH = path.join(getHomeDir(), 'config.json')

const initConfigFile = async () => {
  const config = {
    "_version": LATEST_CONFIG_VERSION,
    "_informed_consent": true,
    "sharing": {
      "include_ip": false,
      "include_asn": true,
      "include_country": true,
      "upload_results": true
    },
    "nettests": {
      "websites_url_limit": 0
    },
    "advanced": {
      "use_domain_fronting": false,
      "send_crash_reports": true,
      "collect_usage_stats": true,
      "collector_url": "",
      "bouncer_url": "https://bouncer.ooni.io"
    }
  }
  await fs.ensureFile(OONI_CONFIG_PATH)
  await fs.writeJson(OONI_CONFIG_PATH, config, {spaces: '  '})
}

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
  try {
    const config = await fs.readJson(OONI_CONFIG_PATH)
    return config
  } catch (err) {
    return null
  }
}

const migrationMap = {
  '1->2': (config) => {
    config['_version'] = 2
    if (config['advanced']['collect_usage_stats'] === undefined) {
      config['advanced']['collect_usage_stats'] = true
    }
    return config
  }
}

const migrate = (config, currentVersion, targetVersion) => {
  const func = migrationMap[`${currentVersion}->${targetVersion}`]
  if (func !== undefined) {
    return func(config)
  }
  log.error(`missing migrate function from ${currentVersion}->${targetVersion}`)
}

const maybeMigrate = async () => {
  let config = await getConfig()

  if (!config) {
    return
  }

  if (config['_version'] == LATEST_CONFIG_VERSION) {
    return
  }
  if (config['_version'] > LATEST_CONFIG_VERSION) {
    log.error('config file from the future')
    return
  }
  for (let ver = config['_version']; ver < LATEST_CONFIG_VERSION; ver++) {
    config = migrate(config, ver, ver+1)
  }
  await fs.writeJson(OONI_CONFIG_PATH, config, {spaces: '  '})
}

module.exports = {
  initConfigFile,
  getConfig,
  setConfig,
  maybeMigrate
}
