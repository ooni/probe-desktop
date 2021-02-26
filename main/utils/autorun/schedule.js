const scheduleAutorun = () => {
  const { join } = require('path')
  const { initConfigFile } = require('../config')
  const { getAutorunHomeDir } = require('../paths')

  // Initialize OONI_HOME for autorun by generating a fresh config file
  // in the OONI_HOME for autorun
  // Note: initConfigFile in turn initializes Sentry (again) with no extra effect
  initConfigFile({ configFilePath: join(getAutorunHomeDir(), 'config.json') })

  const autorunTask = require('./task')
  return autorunTask.create()
}

module.exports = scheduleAutorun