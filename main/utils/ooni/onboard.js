/* global module, require */
const { initConfigFile } = require('../config')

module.exports = () => {
  return initConfigFile()
}
