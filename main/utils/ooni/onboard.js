/* global module, require */
const { initConfigFile } = require('../config')

module.exports = (opts) => {
  return initConfigFile(opts)
}
