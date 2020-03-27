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

const execHardReset = (app) => {
  return new Promise((resolve, reject) => {
    const err = app.client.executeAsync(function(done) {
      require('electron')
        .remote.require('./actions')
        .hardReset()
        .then(() => {
          console.log('done')
          done()
        }, (err) => {
          console.log('err')
          console.log(done(err))
        })
    })
    if (err !== undefined) {
      return reject(err)
    }
    return resolve()
  })
}

module.exports = {
  async startApp() {
    const app = await new Application({
      path: electronPath,
      args: [path.join(__dirname, '..')],
      startTimeout: 30000,
      waitTimeout: 30000,
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
    await app.client.waitUntilWindowLoaded()
    await execHardReset(app)
    console.log('...done.')
  },

  async screenshotApp(app) {
    if (app && app.isRunning) {
      const screenshotBuffer = await app.browserWindow.capturePage()
    }
  }
}
