const { startApp, stopApp } = require('./utils')
const { expect } = require('chai')

describe('Sidebar Works', function() {
  this.timeout(30000)
  let app

  beforeEach(async function() {
    app = await startApp()
  })

  afterEach(async function() {
    await stopApp(app)
  })

  it('should just do a noop', async function() {
    await expect(true).to.be.true
  })
})
