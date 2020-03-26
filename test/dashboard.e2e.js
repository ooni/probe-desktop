const { startApp, stopApp } = require('./utils')

describe('Application launch', function() {
  this.timeout(30000)

  let app

  beforeEach(async function() {
    app = await startApp()
  })

  afterEach(async function() {
    await stopApp(app)
  })

  it('launches the window with home page', async function() {
    await app.browserWindow.getTitle().should.eventually.equal('OONI Probe')
    await app.client.getUrl().should.eventually.include('home')
  })

  it('cards are visible', async function() {
    await app.client
      .isVisible('div[data-test-id|="card"]')
      .should.eventually.have.property('length')
      .and.equal(5)
  })
})
