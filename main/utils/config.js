/* global require, module */
const path = require('path')
const fs = require('fs-extra')
const log = require('electron-log')
const { ipcMain } = require('electron')

const { getHomeDir } = require('./paths')

const LATEST_CONFIG_VERSION = 4

const OONI_CONFIG_PATH = path.join(getHomeDir(), 'config.json')

const availableCategoriesList = [
  'ALDR',
  'ANON',
  'COMM',
  'COMT',
  'CTRL',
  'CULTR',
  'DATE',
  'ECON',
  'ENV',
  'FILE',
  'GAME',
  'GMB',
  'GOVT',
  'GRP',
  'HACK',
  'HATE',
  'HOST',
  'HUMR',
  'IGO',
  'LGBT',
  'MILX',
  'MMED',
  'NEWS',
  'POLR',
  'PORN',
  'PROV',
  'PUBH',
  'REL',
  'SRCH',
  'XED'
]

const defaultOptions = {
  optout: false,
  configFilePath: OONI_CONFIG_PATH
}

const initConfigFile = async (options) => {
  const opts = Object.assign(defaultOptions, options)
  const config = {
    '_version': LATEST_CONFIG_VERSION,
    '_informed_consent': true,
    'sharing': {
      'include_ip': false,
      'include_asn': true,
      'upload_results': true
    },
    'nettests': {
      'websites_enabled_category_codes': availableCategoriesList,
      'websites_enable_max_runtime': true,
      'websites_max_runtime': 90
    },
    'advanced': {
      'use_domain_fronting': false,
      'send_crash_reports': !opts.optout,
      'collect_usage_stats': !opts.optout,
      'collector_url': '',
      'bouncer_url': 'https://bouncer.ooni.io'
    }
  }
  await fs.ensureFile(opts.configFilePath)
  await fs.writeJson(opts.configFilePath, config, {spaces: '  '})

  // Now that a config file is available, let's try to initialize Sentry again
  require('../utils/sentry')()
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
  if (JSON.stringify(currentOldValue) !== JSON.stringify(currentValue)) {
    log.info('setConfig: config file path', OONI_CONFIG_PATH)
    log.error('setConfig: inconsistent config file', currentOldValue, currentValue)
    throw Error('inconsistent config file')
  }
  setIndex(config, optionKey, newValue)
  await fs.writeJson(OONI_CONFIG_PATH, config, {spaces: '  '})
  return config
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
  '0->1': (config) => {
    config['_version'] = 1
    return config
  },
  '1->2': (config) => {
    config['_version'] = 2
    if (config['advanced']['collect_usage_stats'] === undefined) {
      config['advanced']['collect_usage_stats'] = true
    }
    if (config['sharing']['include_country'] === false) {
      config['sharing']['upload_results'] = false
    }
    delete config['sharing']['include_country']
    return config
  },
  '2->3': (config) => {
    config['_version'] = 3
    if (config['nettests']['websites_enabled_category_codes'] === undefined
      || config['nettests']['websites_enabled_category_codes'] === null
    ) {
      config['nettests']['websites_enabled_category_codes'] = availableCategoriesList
    }
    return config
  },
  '3->4': (config) => {
    config['_version'] = 4
    if (config['nettests'].hasOwnProperty('websites_url_limit')) {
      delete config['nettests']['websites_url_limit']
    }
    if (!config['nettests'].hasOwnProperty('websites_enable_max_runtime')) {
      config['nettests']['websites_enable_max_runtime'] = true
    }
    if (!config['nettests'].hasOwnProperty('websites_max_runtime')) {
      config['nettests']['websites_max_runtime'] = 90
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

ipcMain.handle('get-fresh-config', async () => {
  return await getConfig()
})

module.exports = {
  initConfigFile,
  getConfig,
  setConfig,
  maybeMigrate,
  availableCategoriesList
}
