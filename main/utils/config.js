const path = require('path')
const { homedir } = require('os')

const fs = require('fs-extra')
const { watch } = require('chokidar')

const OONI_CONFIG_PATH = path.join(homedir(), '.ooni', 'config.json')

const getConfig = async () => {
  const config = await fs.readJson(OONI_CONFIG_PATH)
  // XXX do we want to do some exception handling in here?
  return config
}

const getSentryConfig = () => {
  return {
    dsn: 'https://e1eef2aaa6054d94bffc4a648fb78f09@sentry.io/1210892',
    environment: 'development'
  }
}
module.exports = {
  getConfig,
  getSentryConfig
}
