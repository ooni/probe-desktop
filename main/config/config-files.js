const fs = require('fs-extra')

const path = require('path')

const lockFile = require('lockfile')

const { getHomeDir } = require('../utils/paths')

const OONI_DIR = getHomeDir()
const CONFIG_FILE_PATH = path.join(OONI_DIR, 'config.json')
const CONFIG_LOCK_PATH = path.join(OONI_DIR, 'config.lock')

const prettify = obj => JSON.stringify(obj, null, 2)

const readConfigFileSync = () => fs.readFileSync(CONFIG_FILE_PATH, 'utf8')
const readConfigFile = () => fs.readFile(CONFIG_FILE_PATH, 'utf8')
const readConfigJson = () => fs.readJson(CONFIG_FILE_PATH)
const readConfigJsonSync = () => fs.readJsonSync(CONFIG_FILE_PATH)

const writeToConfigFileSync = obj => fs.writeFileSync(CONFIG_FILE_PATH, prettify(obj))
const writeToConfigFile = obj => fs.writeFile(CONFIG_FILE_PATH, prettify(obj))

const getConfigFilePath = () => CONFIG_FILE_PATH

const setDescendantProp = (obj, s, value) => {
    let p = s.split("."),
        currentPath = obj,
        i = 0

    while(i < p.length - 1) {
      if (currentPath[p[i]] === undefined) {
        currentPath = {}
      }
      currentPath = currentPath[p[i]]
      i++
    }
    currentPath[p[p.length - 1]] = value
    return obj
}

const getDescendantProp = (obj, s) => {
    let p = s.split("."),
        currentPath = obj,
        i = 0

    while(i < p.length) {
      currentPath = currentPath[p[i]]
      i++
    }
    return currentPath
}

const asyncLock = (path, opts) => {
  return new Promise((resolve, reject) => {
    lockFile.lock(path, opts, (err) => {
      if (err) return reject(err)
      resolve()
    })
  })
}

const asyncUnlock = (path, opts) => {
  return new Promise((resolve, reject) => {
    lockFile.unlock(path, opts, (err) => {
      if (err) return reject(err)
      resolve()
    })
  })
}

const withConfigFileLock = async (func) => {
  await asyncLock(CONFIG_LOCK_PATH)

  await func()

  await asyncUnlock(CONFIG_LOCK_PATH)
}

const setConfigKey = (key, value, existingValue) => {
  /*
   * Set a certain key in the config file in a safe way, by wrapping the writing
   * to the config file in an atomic transaction.
   * key: is a dotted path to the key inside of the config file, for example:
   *      `sharing.include_ip`.
   *
   * existingValue: if existingValue is set to something it will throw an
   * exception when the existingValue is found to have changed while the config
   * file is being written.
   */
  return withConfigFileLock(async () => {
    let config = await readConfigFile()
    if (existingValue !== undefined) {
      if (existingValue !== getDescendantProp(config, key)) {
        throw Error('Inconsistency detected')
      }
    }
    config = setDescendantProp(config, key, value)
    await writeToConfigFile(config)
  })
}

module.exports = {
  setConfigKey,
  getDescendantProp,
  setDescendantProp,
  getConfigFilePath,
  writeToConfigFile,
  writeToConfigFileSync,
  readConfigFile,
  readConfigFileSync,
  readConfigJson,
  readConfigJsonSync,
  prettify
}
