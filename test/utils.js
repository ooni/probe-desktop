const Application = require('spectron').Application
// Require Electron from the binaries included in node_modules.
const electronPath = require('electron')
const path = require('path')
const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')

global.before(async function() {
  chai.should()
  chai.use(chaiAsPromised)
})

module.exports = {
  async startApp() {
    const app = await new Application({
      path: electronPath,
      args: [path.join(__dirname, '..')],
      startTimeout: 30000,
      chromeDriverArgs: ['–remote-debugging-port=12209']
    })

    chaiAsPromised.transferPromiseness = app.transferPromiseness

    return app.start()
  },

  async stopApp(app) {
    if (app && app.isRunning()) {
      await app.stop()
    }
  },

  async resetData(app) {
    console.log('Resetting `$OONI_HOME`...')
    const resetResponse = await app.client.execute(function() {
      return require('electron')
        .remote.require('./actions')
        .hardReset()
    })
    if (resetResponse.value === null) {
      console.log('...done.')
    }
  },

  async screenshotApp(app) {
    if (app && app.isRunning) {
      const screenshotBuffer = await app.browserWindow.capturePage()
    }
  }
}
