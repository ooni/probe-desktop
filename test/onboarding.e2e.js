const { startApp, stopApp, resetData, screenshotApp } = require('./utils')

describe('Onboarding', function() {

  let app

  beforeAll(async function() {
    jest.setTimeout(30000)
    // Launch the app
    app = await startApp()
    // Purge the config before running tests
    await resetData(app)
  })

  afterAll(async function() {
    await stopApp(app)
  })

  it('launches the app with onboarding screen', async function() {
    await expect(app.browserWindow.getTitle()).resolves.toBe('OONI Probe')
    await expect(app.client.getUrl()).resolves.toMatch(/onboard/)
  })

  it('first screen renders correctly', async function() {
    await expect(app.client.getText('h1'))
      .resolves.toBe('What is OONI Probe?')
  })

  it('goes to second screen', async function() {
    await expect(app.client
      .$('button')
      .click()
      .getText('h1')
    ).resolves.toBe('Heads-up!')
  })

  it('goes to pop quiz', async function() {
    await expect(app.client
      .$('button')
      .click()
      .getText('h3')
    ).resolves.toBe('Pop Quiz')
    await expect(app.client
      .getText('h4[data-test-id=pop-quiz-question]')
    ).resolves.toBe('Question 1/2')
  })

  it('accepts first pop quiz answer correctly', async function() {
    await expect(app.client
      .$('div=True')
      .click()
      .pause(2000)
      .getText('h4[data-test-id=pop-quiz-question]')
    ).resolves.toBe('Question 2/2')
  })

  it('accepts second pop quiz answer correctly', async function() {
    await expect(app.client
      .$('div=True')
      .click()
      .pause(2000)
      .getText('h1')
    ).resolves.toBe('Crash Reporting')
  })

  it('allows opting in to crash reporting', async function() {
    await expect(app.client
      .$('button=Yes')
      .click()
      .pause(2000)
      .getText('h1')
    ).resolves.toBe('Default Settings')
  })

  it('finishes onboarding and shows dashboard', async function () {
    await expect(app.client
      .click('button[data-test-id=letsgo]')
      .pause(1000)
      .getText('button[data-test-id=dashboard-run-button]')
    ).resolves.toBe('Run')
    screenshotApp(app, 'onboarding-success')
  })

  it('confirm crash reporting is enabled in settings', async function () {
    await expect(app.client
      .click('div=Settings')
      .getText('h3')
    ).resolves.toBe('Settings')
    await expect(app.client
      .isSelected('[data-test-id="advanced.send_crash_reports"]')
    ).resolves.toBe(true)
  })
})
