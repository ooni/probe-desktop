const { startApp, stopApp, screenshotApp } = require('./utils')
import En from '../lang/en.json'

describe('Dashboard tests', () => {
  let app

  beforeAll(async () => {
    app = await startApp()
  })

  afterAll(async () => {
    await stopApp(app)
  })

  afterEach(async () => {
    await screenshotApp(app, expect.getState().currentTestName)
  })

  test('Run button is displayed on Dashboard', async () => {
    const runButtonText = await app.client
      .$('button[data-testid=button-dashboard-run]')
      .getText()

    expect(runButtonText).toMatch('Run')
  })

  describe('All 5 test cards are visible', () => {
    const testDetails = [
      {
        id: 'websites',
        name: 'Websites',
        desc: 'Test the blocking of websites',
      },
      {
        id: 'im',
        name: 'Instant Messaging',
        desc: 'Test the blocking of instant messaging apps',
      },
      {
        id: 'circumvention',
        name: 'Circumvention',
        desc: 'Test the blocking of censorship circumvention tools',
      },
      {
        id: 'performance',
        name: 'Performance',
        desc: 'Test your network speed and performance',
      },
      {
        id: 'middlebox',
        name: 'Middleboxes',
        desc: 'Detect middleboxes in your network',
      },
    ]

    testDetails.forEach((itr) => {
      test(`${itr.id} test card is visible`, async () => {
        const isCardVisible = await app.client.isVisible(
          `div[data-testid=run-card-${itr.id}]`
        )
        expect(isCardVisible).toBe(true)

        const cardName = await app.client.getText(
          `div[data-testid=run-card-${itr.id}] div[data-testid=run-card-name-${itr.id}]`
        )
        expect(cardName).toBe(itr.name)

        const cardDesc = await app.client.getText(
          `div[data-testid=run-card-${itr.id}] div[data-testid=run-card-description-${itr.id}]`
        )
        expect(cardDesc).toBe(itr.desc)
      })
    })
  })

  test('Clicking on "Test Results" tab loads the Test Results Page', async () => {
    await app.client
      .$(`div=${En['TestResults.Overview.Tab.Label']}`)
      .click()
      .pause(1000)

    const labelTests = await app.client
      .$('div[data-testid=overview-tests]')
      .getText()
    const labelNetworks = await app.client
      .$('div[data-testid=overview-networks]')
      .getText()
    const labelDataUsage = await app.client
      .$('div[data-testid=overview-data-usage-label]')
      .getText()

    expect(labelTests).toContain('Tests')
    expect(labelNetworks).toContain('Networks')
    expect(labelDataUsage).toContain('Data Usage')

    // screenshotApp(app, 'dashboard-test-results')
  })

  test('Clicking on "Settings" tab loads the Settings page', async () => {
    await app.client
      .$(`div=${En['Settings.Title']}`)
      .click()
      .pause(1000)

    // Checking for the "Settings" heading
    // Rest of the assertions are in settings.e2e.js
    const labelTestOptionsVisible = await app.client.isVisible('h3=Settings')
    expect(labelTestOptionsVisible).toBe(true)

    // screenshotApp(app, 'dashboard-settings-page')
  })
})
