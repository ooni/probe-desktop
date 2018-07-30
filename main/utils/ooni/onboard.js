/* global windows */
const { Ooniprobe } = require('./ooniprobe')

module.exports = async () => {
  const ooni = new Ooniprobe()
  await ooni.call(['onboard', '--yes'])
}
