const { startApp, stopApp, resetData } = require('./utils')

describe('Application launch', function() {
  this.timeout(30000)

  let app

  before(async function() {
    app = await startApp()
    // Purge the config before running tests
    await resetData(app)
    await stopApp(app)
  })

  before(async function() {
    // Launch the app
    app = await startApp()
  })

  after(async function() {
    await stopApp(app)
  })

  it('launches the app with onboarding screen', async function() {
    await app.browserWindow.getTitle().should.eventually.equal('OONI Probe')
    await app.client.getUrl().should.eventually.include('onboard')
  })

  describe('Onboarding Process', function() {
    it('first screen renders correctly', async function() {
      await app.client
        .getText('h1')
        .should.eventually.equal('What is OONI Probe?')
    })
    it('goes to second screen', async function() {
      await app.client
        .$('button')
        .click()
        .getText('h1')
        .should.eventually.equal('Heads-up!')
    })
    it('goes to pop quiz', async function() {
      await app.client
        .$('button')
        .click()
        .getText('h3')
        .should.eventually.equal('Pop Quiz')
        .getText('h4')
        .should.eventually.equal('Question 1/2')
    })
    // it('accepts pop quiz answers correctly', async function() {
    //   await app.client
    //     .$('div=True')
    //     .click()
    //     .getText('h4')
    //     .should.eventually.equal('Question 2/2')
    // })
  })

  // it('cards are visible', async function() {
  //   await app.client
  //     .isVisible('div[data-test-id|="card"]')
  //     .should.eventually.have.property('length')
  //     .and.equal(5)
  // })
})
