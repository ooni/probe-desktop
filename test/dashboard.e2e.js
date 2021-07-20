const { startApp, stopApp } = require('./utils')
import En from '../lang/en.json'

// Skipping because the app opens the About window before the main Window
// which is picked by spectron to query for dashboard elements.
// This needs to be enabled after carefully fixing the autoupdate code that
// causes this behaviour in NODE_ENV='test' in `main/index.js:170`
describe('Dashboard', () => {
  let app

  beforeAll(async () => {
    app = await startApp()
  })

  afterAll(async () => {
    await stopApp(app)
  })

  test('Run button is displayed correctly', async () => {
    const runButtonVisible = await app.client.isVisible(
      'button[data-testid=dashboard-run-button]'
    )
    const runButtonText = await app.client
      .$('button[data-testid=dashboard-run-button]')
      .getText()

    expect(runButtonVisible).toBeTruthy()
    expect(runButtonText).toMatch(En['Dashboard.Overview.Run'])
  })

  test('5 test cards are visible', async () => {
    await expect(
      app.client.isVisible('div[data-testid="card"]')
    ).resolves.toHaveProperty('length', 5)
  })

  test('Clicking on "Test Results" tab loads it up correctly', async () => {
    await app.client.$(`div=${En['TestResults.Overview.Tab.Label']}`).click().pause(1000)

    const labelTests = await app.client.$('div[data-testid=overview-label-tests]').getText()
    const labelNetworks = await app.client.$('div[data-testid=overview-label-networks]').getText()
    const labelDataUsage = await app.client.$('div[data-testid=overview-label-data-usage]').getText()

    expect(labelTests).toContain('Tests')
    expect(labelNetworks).toContain('Networks')
    expect(labelDataUsage).toContain('Data Usage')
  })

  test('Clicking on "Settings" tab loads it up correctly', async () => {
    await app.client.$(`div=${En['Settings.Title']}`).click().pause(1000)

    // Checking for the "Settings" heading
    // Rest of the assertions are in settings.e2e.js
    const labelTestOptionsVisible = await app.client.isVisible('h3=Settings')
    expect(labelTestOptionsVisible).toBe(true)
  })
})
