const path = require('path')
const fs = require('fs-extra')

const { getHomeDir } = require('./paths')

const OONI_CONFIG_PATH = path.join(getHomeDir(), 'config.json')

const getConfig = async () => {
  const config = await fs.readJson(OONI_CONFIG_PATH)
  // XXX do we want to do some exception handling in here?
  return config
}

module.exports = {
  getConfig
}
