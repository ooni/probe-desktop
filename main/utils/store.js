const Store = require('electron-store')
const log = require('electron-log')
const { join } = require('path')
const { getBinaryDirectory } = require('./paths')
const { existsSync, ensureFileSync } = require('fs-extra')

const schema = {
  autorun: {
    type: 'object',
    default: {},
    properties: {
      enabled: {
        type: 'boolean',
        default: false
      },
      remind: {
        type: 'boolean',
        default: true
      },
      backoffRate: {
        type: 'number',
        default: 0
      },
      interactions: {
        type: 'number',
        default: 1,
      },
      timestamp: {
        type: 'number',
        default: 0
      }
    }
  }
}

let store = null

const init = () => {
  if (!store) {
    store = new Store({
      name: 'settings',
      schema: schema
    })
    const firstRunFilePath = join(getBinaryDirectory(), '.first-run')
    log.debug(`Checking for first-run file at: ${firstRunFilePath}`)
    if (!existsSync(firstRunFilePath)) {
      log.info('Running first time. Reset autorun settings to prompt again')
      store.reset('autorun')
      try {
        ensureFileSync(firstRunFilePath)
        log.debug('first-run file created')
      } catch (e) {
        log.error(`Failed to create first-run file: ${e.message}`)
      }
    }
    log.info(`Initialized store in ${store.path}.`)
  }
  return store
}

const get = (key) => {
  try {
    return store.get(key)
  } catch (e) {
    log.error(`Failed to get ${key} from store: ${e.message}`)
    return null
  }
}

const set = (key, value) => {
  if (typeof key !== 'string') {
    log.error(`store.set: 'key' should be a 'string'. Found ${typeof key}`)
    return
  }
  if (typeof key === 'string' && !store.has(key)) {
    log.error(`${key} not present in store. Initialize it in the schema first.`)
    return
  }

  try {
    store.set(key, value)
    log.debug(`Store saved: ${key}: ${value}`)
  } catch (e) {
    log.error(`Failed to store {${key}: ${value}}: ${e.message}`)
  }
}

const reset = (...keys) => {
  try {
    return store.reset(keys)
  } catch (e) {
    log.error(`Failed to do 'reset${keys}' in store: ${e.message}`)
    return false
  }
}

module.exports = {
  init,
  get,
  set,
  reset
}
