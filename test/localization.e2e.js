const { startApp, stopApp, screenshotApp } = require('./utils')

describe('Localized version is displayed for supported languages', () => {
  let app

  beforeAll(async () => {
    app = await startApp({ locale: 'fr' })
  })

  afterAll(async () => {
    await stopApp(app)
  })

  afterEach(async () => {
    await screenshotApp(app, expect.getState().currentTestName)
  })

  // Tests
  test('Check if the app shows content in French', async () => {
    // 'Run' button label
    const runButtonText = await app.client
      .$('button[data-testid=button-dashboard-run]')
      .getText()

    expect(runButtonText).toMatch('Lancer')
  })
})

describe('Unsupported language (Malayalam) falls back to English', () => {
  let app

  beforeAll(async () => {
    app = await startApp({ locale: 'ml' })
  })

  afterAll(async () => {
    await stopApp(app)
  })

  afterEach(async () => {
    await screenshotApp(app, expect.getState().currentTestName)
  })

  test('Run button label in English', async () => {
    // 'Run' button label
    const runButtonText = await app.client
      .$('button[data-testid=button-dashboard-run]')
      .getText()
    expect(runButtonText).toMatch('Run')
  })
})
