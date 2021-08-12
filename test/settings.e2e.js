const { startApp, stopApp, screenshotApp } = require('./utils')
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

  afterEach(async () => {
    await screenshotApp(app, expect.getState().currentTestName)
  })

  test('Clicking on "Settings" tab loads it up correctly', async () => {
    await app.client
      .$('div[data-testid=sidebar-item-settings]')
      .click()
      .pause(1000)

    await app.client.waitUntilWindowLoaded()

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
    await app.client
      .$('select[data-testid=select-language]')
      .click()
      .pause(1000)
    await app.client
      .$('option=Spanish')
      .click()
      .pause(1000)

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

    // await screenshotApp(app, 'settings-in-spanish')
  })

  test('Language changes in other screens', async () => {
    // Checking for Test Results screen
    await app.client
      .$('div[data-testid=sidebar-item-test-results]')
      .click()
      .pause(1000)

    await app.client.waitUntilWindowLoaded()

    const labelTests = await app.client
      .$('div[data-testid=overview-tests]')
      .getText()
    const labelNetworks = await app.client
      .$('div[data-testid=overview-networks]')
      .getText()
    const labelDataUsage = await app.client
      .$('div[data-testid=overview-data-usage-label]')
      .getText()

    expect(labelTests).toContain('Pruebas')
    expect(labelNetworks).toContain('Redes')
    expect(labelDataUsage).toContain('Uso de datos')

    await screenshotApp(app, 'test-results-in-spanish')

    // Checking for Dashboard screen
    await app.client
      .$('div[data-testid=sidebar-item-dashboard]')
      .click()
      .pause(1000)

    await app.client.waitUntilWindowLoaded()

    const runButtonText = await app.client
      .$('button[data-testid=button-dashboard-run]')
      .getText()

    expect(runButtonText).toMatch(Es['Dashboard.Overview.Run'])

    // await screenshotApp(app, 'dashboard-in-spanish')
  })

  test('Changing language back to En', async () => {
    await app.client
      .$('div[data-testid=sidebar-item-settings]')
      .click()
      .pause(1000)

    await app.client.waitUntilWindowLoaded()

    await app.client
      .$('select[data-testid=select-language]')
      .click()
      .pause(1000)
    await app.client
      .$('option=inglés')
      .click()
      .pause(1000)

    const languageLabelEn = await app.client.isVisible('label=Language')
    expect(languageLabelEn).toBe(true)

    // await screenshotApp(app, 'settings-in-english')
  })

  test('Clicking on button to edit Website categories brings up modal', async () => {
    await app.client
      .$('button[data-testid=website-categories-edit-button]')
      .click()
      .pause(1000)

    const modalHeadingVisible = await app.client.isVisible(
      `h4=${En['Settings.Websites.Categories.Label']}`
    )
    expect(modalHeadingVisible).toBe(true)

    const saveButtonEnabled = await app.client.isEnabled(
      `button=${En['Settings.Websites.Categories.Selection.Done']}`
    )
    expect(saveButtonEnabled).toBe(false)

    // await screenshotApp(app, 'settings-website-selection-modal')
  })

  test('Modal Deselect All buttons work as expected', async () => {
    const websiteCount = await app.client.getText(
      'div[data-testid=website-category-count]'
    )
    expect(websiteCount).toBe('30 categories enabled')

    await app.client
      .$(`button=${En['Settings.Websites.Categories.Selection.None']}`)
      .click()
      .pause(1000)

    await app.client
      .$(`button=${En['Settings.Websites.Categories.Selection.Done']}`)
      .click()
      .pause(1000)

    const websiteCountNew = await app.client.getText(
      'div[data-testid=website-category-count]'
    )
    expect(websiteCountNew).toBe('0 categories enabled')

    // await screenshotApp(app, 'settings-no-website-category-selected')
  })

  test('Modal Select All buttons work as expected', async () => {
    await app.client
      .$('button[data-testid=website-categories-edit-button]')
      .click()
      .pause(1000)

    await app.client
      .$(`button=${En['Settings.Websites.Categories.Selection.All']}`)
      .click()
      .pause(1000)

    await app.client
      .$(`button=${En['Settings.Websites.Categories.Selection.Done']}`)
      .click()
      .pause(1000)

    const websiteCountNew = await app.client.getText(
      'div[data-testid=website-category-count]'
    )
    expect(websiteCountNew).toBe('30 categories enabled')

    // await screenshotApp(app, 'settings-all-website-categories-selected')
  })

  test('Individual categories can be enabled or disabled', async () => {
    await app.client.waitUntilWindowLoaded()

    await app.client
      .$('button[data-testid=website-categories-edit-button]')
      .click()
      .pause(1000)

    // Simulate unchecking of checkboxes by clicking on them
    await app.client
      .$('input[data-testid=category-checkbox-ANON]')
      .click()
      .pause(1000)
    await app.client
      .$('input[data-testid=category-checkbox-CTRL]')
      .click()
      .pause(1000)
    await app.client
      .$('input[data-testid=category-checkbox-GAME]')
      .click()
      .pause(1000)
    await app.client
      .$('input[data-testid=category-checkbox-LGBT]')
      .click()
      .pause(1000)

    await app.client
      .$(`button=${En['Settings.Websites.Categories.Selection.Done']}`)
      .click()
      .pause(1000)

    const websiteCountNew = await app.client.getText(
      'div[data-testid=website-category-count]'
    )
    expect(websiteCountNew).toBe('26 categories enabled')

    await screenshotApp(app, 'settings-some-website-categories-selected')

    // Bring back to default settings (all website categories selected)
    await app.client
      .$('button[data-testid=website-categories-edit-button]')
      .click()
      .pause(1000)
    await app.client
      .$(`button=${En['Settings.Websites.Categories.Selection.All']}`)
      .click()
      .pause(1000)
    await app.client
      .$(`button=${En['Settings.Websites.Categories.Selection.Done']}`)
      .click()
      .pause(1000)
  })
})
