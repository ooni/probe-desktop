const fs = require('fs-extra')
const path = require('path')
const { homedir } = require('os')

const debug = require('debug')('ooniprobe-desktop.main.config.legacy')

const oldOoniHomePath = path.join(homedir(), '.ooni')
const oldOoniHomeExists = () => (fs.pathExists(path.join(oldOoniHomePath, 'ooniprobe.conf')))
const backupLegacyHome = async () => {
  const legacyPath = path.join(homedir(),
                               '.ooni-legacy')
  err = await fs.move(oldOoniHomePath, legacyPath)
  if (err) {
    debug(`Failed to rename ${oldOoniHomePath} to ${legacyPath}`)
    debug(err)
    await exit(1)
    return
  }
  debug(`Renamed ${oldOoniHomePath} to ${legacyPath}`)
}

module.exports = {
  oldOoniHomePath,
  oldOoniHomeExists,
  backupLegacyHome,
}
