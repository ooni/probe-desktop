const { startApp, stopApp } = require('./utils')

// Skipping because the app opens the About window before the main Window
// which is picked by spectron to query for dashboard elements.
// This needs to be enabled after carefully fixing the autoupdate code that
// causes this behaviour in NODE_ENV='test' in `main/index.js:170`
describe.skip('Dashboard', () => {

  let app

  beforeAll(async () => {
    jest.setTimeout(30000)
    // Launch the app
    app = await startApp()
  })

  afterAll(async () => {
    await stopApp(app)
  })

  it('5 test cards are visible', async () => {
    await expect(app.client
      .isVisible('div[data-testid="card"]')
    ).resolves.toHaveProperty('length', 5)
  })
})
