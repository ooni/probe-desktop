const { init } = require('@sentry/electron/main')
const isDev = require('electron-is-dev')
const log = require('electron-log/main')

const { name } = require('../../package.json')
const { getConfig } = require('../utils/config')

const initializeSentry = async () => {
  log.info('Initializing Sentry in main...')
  try {
    const config = await getConfig()
    if (config && config.hasOwnProperty('advanced')
     && config.advanced.send_crash_reports === true
    ) {
      init({
        enabled: process.env.NODE_ENV === 'production',
        dsn: 'https://e1eef2aaa6054d94bffc4a648fb78f09@o155150.ingest.sentry.io/1210892',
        environment: isDev ? 'development' : 'production',
        debug: isDev,
        appName: name
      })
      log.debug('Sentry initialized in main.')
    } else {
      log.debug('Crash reporting not enabled in config. Sentry not initialized in main.')
    }
  } catch (e) {
    log.error('Initializing Sentry failed: ', e)
  }
}

module.exports = initializeSentry
