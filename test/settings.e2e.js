const { startApp, stopApp, screenshotApp } = require('./utils')
import En from '../lang/en.json'
import Es from '../lang/es.json'

describe('Tests for Settings page', () => {
  let app

  beforeAll(async () => {
    app = await startApp()
  })

  afterAll(async () => {
    if (app && app.isRunning()) {
      await stopApp(app)
    }
  })

  afterEach(async () => {
    await screenshotApp(app, expect.getState().currentTestName)
  })

  test('Clicking on "Settings" tab loads it up correctly', async () => {
    await app.utils.click('div[data-testid=sidebar-item-settings]')

    await app.client.waitUntilWindowLoaded()

    const labelTestOptionsVisible = await app.utils.isDisplayed(
      `h4=${En['Settings.TestOptions.Label']}`
    )
    const labelAutoTestingVisible = await app.utils.isDisplayed(
      `h4=${En['Settings.AutomatedTesting.Label']}`
    )
    const labelPrivacyVisible = await app.utils.isDisplayed(
      `h4=${En['Settings.Privacy.Label']}`
    )

    expect(labelTestOptionsVisible).toBe(true)
    expect(labelAutoTestingVisible).toBe(true)
    expect(labelPrivacyVisible).toBe(true)
  })

  test('Language changes to Spanish', async () => {
    const languageLabelEn = await app.utils.isDisplayed('label=Language')
    expect(languageLabelEn).toBe(true)

    const languageSelectValue = await app.utils.getValue('select[data-testid=select-language]')
    expect(languageSelectValue).toBe('en')

    // Clicking and selecting value instead of using using setValue() because
    // webdriver thinks the <select> option is in a wrong state (uneditable)
    const languageSelector = await app.client.$('select[data-testid=select-language]')
    await languageSelector.selectByVisibleText('Spanish')

    const languageLabelEs = await app.utils.isDisplayed('label=Idioma')
    expect(languageLabelEs).toBe(true)

    // Temporarily reduce timeouts.implicit to fast-fail webdriver::findelement
    const timeouts = await app.client.getTimeouts()

    // English labels are not visible anymore
    await app.client.setTimeout({ implicit: 0 })
    const labelTestOptionsVisibleEn = await app.utils.isDisplayed(
      `h4=${En['Settings.TestOptions.Label']}`
    )
    expect(labelTestOptionsVisibleEn).toBe(false)

    const labelAutoTestingVisibleEn = await app.utils.isDisplayed(
      `h4=${En['Settings.AutomatedTesting.Label']}`
    )
    expect(labelAutoTestingVisibleEn).toBe(false)

    const labelPrivacyVisibleEn = await app.utils.isDisplayed(
      `h4=${En['Settings.Privacy.Label']}`
    )
    expect(labelPrivacyVisibleEn).toBe(false)

    // Spanish labels are visible
    const labelTestOptionsVisibleEs = await app.utils.isDisplayed(
      `h4=${Es['Settings.TestOptions.Label']}`
    )
    expect(labelTestOptionsVisibleEs).toBe(true)

    const labelAutoTestingVisibleEs = await app.utils.isDisplayed(
      `h4=${Es['Settings.AutomatedTesting.Label']}`
    )
    expect(labelAutoTestingVisibleEs).toBe(true)

    const labelPrivacyVisibleEs = await app.utils.isDisplayed(
      `h4=${Es['Settings.Privacy.Label']}`
    )
    expect(labelPrivacyVisibleEs).toBe(true)
    // Restore timeout values
    await app.client.setTimeout(timeouts)
    // await screenshotApp(app, 'settings-in-spanish')
  })

  test('Language changes in other screens', async () => {
    // Checking for Test Results screen
    await app.utils.click('div[data-testid=sidebar-item-test-results]')

    await app.client.waitUntilWindowLoaded()

    const labelTests = await app.utils.getText('div[data-testid=overview-tests]')
    const labelNetworks = await app.utils.getText('div[data-testid=overview-networks]')
    const labelDataUsage = await app.utils.getText('div[data-testid=overview-data-usage-label]')

    expect(labelTests).toContain('Pruebas')
    expect(labelNetworks).toContain('Redes')
    expect(labelDataUsage).toContain('Uso de datos')

    await screenshotApp(app, 'test-results-in-spanish')

    // Checking for Dashboard screen
    await app.utils.click('div[data-testid=sidebar-item-dashboard]')

    await app.client.waitUntilWindowLoaded()

    const runButtonText = await app.utils.getText('button[data-testid=button-dashboard-run]')

    expect(runButtonText).toMatch(Es['Dashboard.Overview.Run'])

    // await screenshotApp(app, 'dashboard-in-spanish')
  })

  test('Changing language back to En', async () => {
    await app.utils.click('div[data-testid=sidebar-item-settings]')

    await app.client.waitUntilWindowLoaded()

    const languageSelector = await app.client.$('select[data-testid=select-language]')
    await languageSelector.selectByVisibleText('inglés')

    const languageLabelEn = await app.utils.isDisplayed('label=Language')
    expect(languageLabelEn).toBe(true)

    // await screenshotApp(app, 'settings-in-english')
  })

  test('Clicking on button to edit Website categories brings up modal', async () => {
    await app.utils.click('button[data-testid=website-categories-edit-button]')

    const modalHeadingVisible = await app.utils.isDisplayed(
      `h4=${En['Settings.Websites.Categories.Label']}`
    )
    expect(modalHeadingVisible).toBe(true)

    const saveButtonEnabled = await app.utils.isEnabled(
      `button=${En['Settings.Websites.Categories.Selection.Done']}`
    )
    expect(saveButtonEnabled).toBe(false)

    // await screenshotApp(app, 'settings-website-selection-modal')
  })

  test('Modal Deselect All buttons work as expected', async () => {
    const websiteCount = await app.utils.getText(
      'div[data-testid=website-category-count]'
    )
    expect(websiteCount).toBe('30 categories enabled')

    await app.utils.click(`button=${En['Settings.Websites.Categories.Selection.None']}`)

    await app.utils.click(`button=${En['Settings.Websites.Categories.Selection.Done']}`)

    const websiteCountNew = await app.utils.getText(
      'div[data-testid=website-category-count]'
    )
    expect(websiteCountNew).toBe('0 categories enabled')

    // await screenshotApp(app, 'settings-no-website-category-selected')
  })

  test('Modal Select All buttons work as expected', async () => {
    await app.utils.click('button[data-testid=website-categories-edit-button]')

    await app.utils.click(`button=${En['Settings.Websites.Categories.Selection.All']}`)

    await app.utils.click(`button=${En['Settings.Websites.Categories.Selection.Done']}`)

    const websiteCountNew = await app.utils.getText(
      'div[data-testid=website-category-count]'
    )
    expect(websiteCountNew).toBe('30 categories enabled')

    // await screenshotApp(app, 'settings-all-website-categories-selected')
  })

  test('Individual categories can be enabled or disabled', async () => {
    await app.client.waitUntilWindowLoaded()

    await app.utils.click('button[data-testid=website-categories-edit-button]')

    // Simulate unchecking of checkboxes by clicking on them
    await app.utils.click('input[data-testid=category-checkbox-ANON]')
    await app.utils.click('input[data-testid=category-checkbox-CTRL]')
    await app.utils.click('input[data-testid=category-checkbox-GAME]')
    await app.utils.click('input[data-testid=category-checkbox-LGBT]')

    await app.utils.click(`button=${En['Settings.Websites.Categories.Selection.Done']}`)

    const websiteCountNew = await app.utils.getText(
      'div[data-testid=website-category-count]'
    )
    expect(websiteCountNew).toBe('26 categories enabled')

    await screenshotApp(app, 'settings-some-website-categories-selected')

    // Bring back to default settings (all website categories selected)
    await app.utils.click('button[data-testid=website-categories-edit-button]')
    await app.utils.click(`button=${En['Settings.Websites.Categories.Selection.All']}`)
    await app.utils.click(`button=${En['Settings.Websites.Categories.Selection.Done']}`)
  })
})
