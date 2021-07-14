const path = require('path')
const fs = require('fs-extra')
const log = require('electron-log')

const { getHomeDir, getAutorunHomeDir } = require('./paths')

const LATEST_CONFIG_VERSION = 5

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
  crashReportsOptIn: false,
  configFilePath: OONI_CONFIG_PATH
}

export const initializeConfig = (opts = {}) => {
  const config = {
    '_version': LATEST_CONFIG_VERSION,
    '_informed_consent': true,
    'sharing': {
      'upload_results': true
    },
    'nettests': {
      'websites_enabled_category_codes': availableCategoriesList,
      'websites_enable_max_runtime': true,
      'websites_max_runtime': 90
    },
    'advanced': {
      'use_domain_fronting': false,
      'send_crash_reports': opts.crashReportsOptIn,
      'collector_url': '',
      'bouncer_url': 'https://bouncer.ooni.io'
    }
  }
  return config
}

/**
 * Initialize config file
 * @param {Object} [options] - Options to  prepare config file before writing to disk
 * @param {string} [options.configFilePath] - path to custom config file to use instead of generating here
 * @param {boolean} [options.crashReportsOptIn] - whether to opt-in to crash reporting
 */

const initConfigFile = async (options = {}) => {
  const opts = Object.assign(defaultOptions, options)
  const config = initializeConfig(opts)
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

const getConfigValue = (config, optionKey) => optionKey.split('.').reduce((o,i) => o[i], config)

const setConfig = async (optionKey, currentValue, newValue) => {
  const config = await getConfig()
  // XXX this is not really atomic. We should ensure atomicity by proxying this
  // via probe-cli.
  const currentOldValue = getConfigValue(config, optionKey)
  if (JSON.stringify(currentOldValue) !== JSON.stringify(currentValue)) {
    log.error('setConfig: inconsistent config file', currentOldValue, currentValue)
    throw Error('inconsistent config file')
  }
  setIndex(config, optionKey, newValue)
  await fs.writeJson(OONI_CONFIG_PATH, config, {spaces: '  '})
  log.debug(`setConfig: wrote ${optionKey}: ${newValue} to config file ${OONI_CONFIG_PATH}`)

  // Sync changes to autorun configuration file
  const autorunConfigPath = path.join(getAutorunHomeDir(), 'config.json')
  fs.pathExists(autorunConfigPath).then(exists => {
    if (exists) {
      fs.writeJson(autorunConfigPath, config, { spaces: ' '})
        .then(() => {
          log.debug('Config file changes synced with autorun config.')
        })
        .catch(e => {
          log.error(`error syncing to autorun config ${autorunConfigPath}: ${e.message}`)
        })
    } else {
      log.verbose(`autorun config ${autorunConfigPath} doesn't exist. Not syncing.'`)
    }
  }).catch(e => {
    log.error(`Error checking for autorun config file: ${e.message}`)
  })
  return config
}

const getConfig = async (key = null) => {
  try {
    const config = await fs.readJson(OONI_CONFIG_PATH)
    if (key === null) {
      return config
    } else {
      return getConfigValue(config, key)
    }
  } catch (err) {
    log.error(err)
    return null
  }
}

const hasOwnProperty = (object, property) => {
  return Object.prototype.hasOwnProperty.call(object, property)
}

const migrationMap = {
  // Note:
  // * Before adding a new key, ensure it doesn't already exist in the file.
  // * Before deleting a key, ensure the key actually exists in the file.
  // * Before switching to a new default value, ensure the previous default wasn't changed

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
    if (hasOwnProperty(config['nettests'], 'websites_url_limit')) {
      delete config['nettests']['websites_url_limit']
    }
    if (!hasOwnProperty(config['nettests'], 'websites_enable_max_runtime')) {
      config['nettests']['websites_enable_max_runtime'] = true
    }
    if (!hasOwnProperty(config['nettests'], 'websites_max_runtime')) {
      config['nettests']['websites_max_runtime'] = 90
    }
    return config
  },
  '4->5': (config) => {
    config['_version'] = 5
    // remove advanced.collect_usage_stats
    if (hasOwnProperty(config['advanced'], 'collect_usage_stats')) {
      delete config['advanced']['collect_usage_stats']
    }
    // remove sharing.include_ip
    if (hasOwnProperty(config['sharing'], 'include_ip')) {
      delete config['sharing']['include_ip']
    }
    // remove sharing.include_asn
    if (hasOwnProperty(config['sharing'], 'include_asn')) {
      delete config['sharing']['include_asn']
    }
    return config
  },
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
  log.info('Config file version changed. Running migrations..')
  for (let ver = config['_version']; ver < LATEST_CONFIG_VERSION; ver++) {
    log.debug(`Migrating from ${ver} to ${ver+1}`)
    config = migrate(config, ver, ver+1)
  }
  log.debug('Config file migration completed. Writing config file to disk.')
  await fs.writeJson(getConfigPath(), config, {spaces: '  '})
}

module.exports = {
  initializeConfig,
  initConfigFile,
  getConfig,
  setConfig,
  maybeMigrate,
  availableCategoriesList
}
