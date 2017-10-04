const path = require('path')
const { homedir } = require('os')

const fs = require('fs-extra')
const { watch } = require('chokidar')

const OONI_CONFIG_PATH = path.join(homedir(), '.ooni', 'config.json')

export const getConfig = async () => {
  const config = await fs.readJson(OONI_CONFIG_PATH)
  // XXX do we want to do some exception handling in here?
  return config
}
