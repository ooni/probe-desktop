const { startApp, stopApp } = require('./utils')
import En from '../lang/en.json'
import Es from '../lang/es.json'

describe('Tests for Settings page', () => {
  let app

  beforeAll(async () => {
    app = await startApp()
  })

  afterAll(async () => {
    await stopApp(app)
  })

  test('Clicking on "Settings" tab loads it up correctly', async () => {
    await app.client
      .$(`div=${En['Settings.Title']}`)
      .click()
      .pause(1000)

    const labelTestOptionsVisible = await app.client.isVisible(
      `h4=${En['Settings.TestOptions.Label']}`
    )
    const labelAutoTestingVisible = await app.client.isVisible(
      `h4=${En['Settings.AutomatedTesting.Label']}`
    )
    const labelPrivacyVisible = await app.client.isVisible(
      `h4=${En['Settings.Privacy.Label']}`
    )

    expect(labelTestOptionsVisible).toBe(true)
    expect(labelAutoTestingVisible).toBe(true)
    expect(labelPrivacyVisible).toBe(true)
  })

  test('Language changes to Spanish', async () => {
    const languageLabelEn = await app.client.isVisible('label=Language')
    expect(languageLabelEn).toBe(true)

    const languageSelectValue = await app.client
      .$('select[data-testid=select-language]')
      .getValue()
    expect(languageSelectValue).toBe('en')

    // Clicking and selecting value instead of using using setValue() because
    // webdriver thinks the <select> option is in a wrong state (uneditable)
    await app.client.$('select[data-testid=select-language]').click()
    await app.client.$('option=Spanish').click()

    const languageLabelEs = await app.client.isVisible('label=Idioma')
    expect(languageLabelEs).toBe(true)

    // English labels are not visible anymore
    const labelTestOptionsVisibleEn = await app.client.isVisible(
      `h4=${En['Settings.TestOptions.Label']}`
    )
    expect(labelTestOptionsVisibleEn).toBe(false)

    const labelAutoTestingVisibleEn = await app.client.isVisible(
      `h4=${En['Settings.AutomatedTesting.Label']}`
    )
    expect(labelAutoTestingVisibleEn).toBe(false)

    const labelPrivacyVisibleEn = await app.client.isVisible(
      `h4=${En['Settings.Privacy.Label']}`
    )
    expect(labelPrivacyVisibleEn).toBe(false)

    // Spanish labels are visible
    const labelTestOptionsVisibleEs = await app.client.isVisible(
      `h4=${Es['Settings.TestOptions.Label']}`
    )
    expect(labelTestOptionsVisibleEs).toBe(true)

    const labelAutoTestingVisibleEs = await app.client.isVisible(
      `h4=${Es['Settings.AutomatedTesting.Label']}`
    )
    expect(labelAutoTestingVisibleEs).toBe(true)

    const labelPrivacyVisibleEs = await app.client.isVisible(
      `h4=${Es['Settings.Privacy.Label']}`
    )
    expect(labelPrivacyVisibleEs).toBe(true)
  })

  test('Language changes in other screens', async () => {
    // Checking for Test Results screen
    await app.client
      .$(`div=${Es['TestResults.Overview.Tab.Label']}`)
      .click()
      .pause(500)

    const labelTests = await app.client
      .$('div[data-testid=overview-label-tests]')
      .getText()
    const labelNetworks = await app.client
      .$('div[data-testid=overview-label-networks]')
      .getText()
    const labelDataUsage = await app.client
      .$('div[data-testid=overview-label-data-usage]')
      .getText()

    expect(labelTests).toContain('Pruebas')
    expect(labelNetworks).toContain('Redes')
    expect(labelDataUsage).toContain('Uso de datos')

    // Checking for Dashboard screen
    await app.client
      .$(`div=${Es['Dashboard.Tab.Label']}`)
      .click()
      .pause(500)
    const runButtonText = await app.client
      .$('button[data-testid=dashboard-run-button]')
      .getText()

    expect(runButtonText).toMatch(Es['Dashboard.Overview.Run'])
  })

  test('Changing language back to En', async () => {
    await app.client
      .$(`div=${Es['Settings.Title']}`)
      .click()
      .pause(500)

    await app.client.$('select[data-testid=select-language]').click()
    await app.client
      .$('option=inglés')
      .click()
      .pause(500)

    const languageLabelEn = await app.client.isVisible('label=Language')
    expect(languageLabelEn).toBe(true)
  })
})
