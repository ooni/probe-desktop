const { app } = require('electron')
const log = require('electron-log/main')
const fs = require('fs-extra')
const { is } = require('electron-util')

const { listResults } = require('./actions')
const { Runner } = require('./utils/ooni/run')
const onboard = require('./utils/ooni/onboard')
const store = require('./utils/store')
const { getConfig, setConfig } = require('./utils/config')

// BUG: The idea *was* to use these constants across main and renderer processes
// to wire up the IPC channels. But importing these directly from renderer
// scripts throws this error: https://github.com/sindresorhus/electron-util/issues/27
const inputFileRequest = 'fs.write.request'
const inputFileResponse = 'fs.write.response'
const lastResultRequest = 'results.last.request'
const lastResultResponse = 'results.last.response'

let testRunner = null
let stopRequested = false
let autorunPromptWaiting = false
let autorunTaskUpdating = false

const ipcBindingsForMain = (ipcMain) => {

  ipcMain.on(inputFileRequest, async (event, data) => {
    const tempDirectoryPath = app.getPath('temp')
    const tempFilename = `${tempDirectoryPath}/${Date.now()}`
    fs.writeFileSync(tempFilename, data.toString())

    // NOTE: We should watch out if this can cause UI/renderer process to block
    event.reply(inputFileResponse, {
      filename: tempFilename
    })
  })

  ipcMain.on(lastResultRequest, async (event, data) => {
    const { testGroupName } = data
    let lastTested = null
    try {
      const results = await listResults()
      if ('rows' in results && results.rows.length > 0) {
        const filteredRows = results.rows.filter(row =>
          testGroupName !== 'all' ? row.name === testGroupName : true
        )
        lastTested = filteredRows.length > 0
          ? filteredRows[filteredRows.length - 1].start_time
          : null
      }
    } catch (e) {
      log.error(e)
    } finally {
      log.debug(`Sending lastResultResponse: ${lastTested}`)
      event.reply(lastResultResponse, {
        lastResult: lastTested
      })
    }
  })

  ipcMain.on('ooniprobe.run', async (event, { testGroupToRun, inputFile }) => {
    const sender = event.sender
    // TODO: Should figure out a way to share this list between main and renderer
    // Cannot import `testGroups` as-is from 'renderer/components/nettests/index.js'
    const supportedTestGroups = ['websites', 'circumvention', 'im', 'middlebox', 'performance', 'experimental']
    // if testGroupToRun is `all` then iterate on a list of all runnable testGroups
    // instead of launching `ooniprobe all` to avoid the maxRuntimeTimer killing
    // tests other than `websites`
    const groupsToRun = testGroupToRun === 'all' ? (
      supportedTestGroups.filter(x => x !== 'default')
    ) : (
      [testGroupToRun]
    )

    // Reset any previous
    stopRequested = false
    for (const testGroup of groupsToRun) {
      if (stopRequested) {
        stopRequested = false
        break
      }
      testRunner = new Runner({
        testGroupName: testGroup,
        inputFile: inputFile
      })

      try {
        sender.send('ooniprobe.running-test', testGroup)
        await testRunner.run()
        sender.send('ooniprobe.done', testGroup)
      } catch (error) {
        sender.send('ooniprobe.error', error)
      }
    }
    sender.send('ooniprobe.completed')
    testRunner = null
  })

  ipcMain.on('ooniprobe.stop', async (event) => {
    if (!testRunner) {
      // if there is not test running, then tell renderer to move on
      stopRequested = false
      event.sender.send('ooniprobe.completed')
    } else {
      testRunner.kill()
      stopRequested = true
    }
  })

  ipcMain.handle('config.onboard', async (event, { crashReportsOptIn = false }) => {
    await onboard({ crashReportsOptIn })
  })

  ipcMain.handle('autorun.status', async () => {
    try {
      const { getAutorunStatus } = require('./utils/autorun/schedule')
      await getAutorunStatus()
      return true
    } catch (e) {
      return false
    }
  })

  ipcMain.handle('autorun.schedule', async () => {
    if (autorunTaskUpdating) {
      return false
    }
    autorunTaskUpdating = true
    try {
      const { scheduleAutorun } = require('./utils/autorun/schedule')
      await scheduleAutorun()
      log.debug('Autorun scheduled.')
      store.set('autorun.remind', false)
      store.set('autorun.enabled', true)
      autorunTaskUpdating = false
      return true
    } catch(e) {
      log.error(`Autorun could not be scheduled. ${e}`)
      autorunTaskUpdating = false
      return false
    }
  })

  ipcMain.handle('autorun.disable', async () => {
    if (autorunTaskUpdating) {
      return false
    }
    try {
      const { disableAutorun } = require('./utils/autorun/schedule')
      await disableAutorun()
      log.debug('Autorun disabled.')
      store.set('autorun.remind', false)
      store.set('autorun.enabled', false)
      autorunTaskUpdating = false
      return true
    } catch(e) {
      log.error(`Autorun could not be disabled. ${e}`)
      autorunTaskUpdating = false
      return false
    }
  })

  // Wait a bit since last reminder, backing off exponentially, to show the prompt with a delay from trigger (page load)
  const SHOW_PROMPT_AFTER_DELAY = 10 * 1000 // 10 seconds
  const A_DAY = 1 * 24 * 60 * 60 * 1000
  const BACKOFF_TIME_MULTIPLIER = A_DAY
  const BACKOFF_INTERACTION_MULTIPLIER = 5
  const backoffPattern = [0, 1, 2, 3, 5]

  ipcMain.on('autorun.remind-later', async () => {
    // Prepare factors to decide when to show next prompt
    const { backoffRate } = store.get('autorun')
    store.set('autorun.timestamp', Date.now())
    store.set('autorun.backoffRate', Math.min(backoffRate + 1, backoffPattern.length -1))
    store.set('autorun.interactions', 0)
    const backOffIndex = backoffPattern[Math.min(backoffRate + 1, backoffPattern.length -1)]
    log.debug(`Autorun reminder backed off ${backOffIndex} days or ${backOffIndex * BACKOFF_INTERACTION_MULTIPLIER} interactions\n\n`)
  })

  ipcMain.on('autorun.cancel', async () => {
    store.set('autorun.remind', false)
    store.set('autorun.enabled', false)
    log.debug('Autorun cancelled.')
  })

  ipcMain.on('autorun.maybe-remind', async (event) => {
    // autorun is only available on mac and windows right now
    if (!(is.windows || is.macos)) {
      log.debug('Skip reminding about autorun because it is only available in MacOS and Windows.')
      return
    }
    // check if autorun is already cancelled or enabled in preferences, then skip the reminder
    const autorunPrefs = store.get('autorun')
    if (autorunPrefs.remind === false || autorunPrefs.enabled === true) {
      log.debug('Skip reminding about autorun because it is already already enabled or explicitly cancelled.')
      return
    }

    // Exponential back-off
    store.set('autorun.interactions', autorunPrefs.interactions + 1)
    if(autorunPrefs.interactions + 1 < backoffPattern[autorunPrefs.backoffRate] * BACKOFF_INTERACTION_MULTIPLIER) {
      log.debug(`Skip autorun reminder. Backing off until ${backoffPattern[autorunPrefs.backoffRate] * BACKOFF_INTERACTION_MULTIPLIER - autorunPrefs.interactions} interactions.`)
      return
    }

    // Don't remind too soon
    const timeSinceLastReminder = Date.now() - autorunPrefs.timestamp
    if (timeSinceLastReminder < backoffPattern[autorunPrefs.backoffRate] * BACKOFF_TIME_MULTIPLIER) {
      log.debug(`Skip autorun reminder. Last reminder was ${Math.round(timeSinceLastReminder/A_DAY)} days ago.`)
      return
    }

    // Ask renderer to show the prompt
    if (!autorunPromptWaiting) {
      autorunPromptWaiting = true
      setTimeout(() => {
        event.sender.send('autorun.showPrompt')
        autorunPromptWaiting = false
      }, SHOW_PROMPT_AFTER_DELAY)
    }
  })

  ipcMain.handle('list-results', async (event, resultID = null) => {
    const { listResults, listMeasurements } = require('./actions')
    if (resultID) {
      return listMeasurements(resultID)
    } else {
      return listResults()
    }
  })

  ipcMain.handle('show-measurement', async (event, msmtID) => {
    const { showMeasurement } = require('./actions')
    return await showMeasurement(msmtID)
  })

  ipcMain.on('prefs.save', (event, { key, value }) => {
    try {
      store.set(key, value)
      event.returnValue = true
    } catch (e) {
      log.error(e)
      event.returnValue = e.message
    }
  })

  ipcMain.on('prefs.get', (event, key) => {
    try {
      const value = store.get(key)
      log.verbose(`prefs.get ${key}: ${value}`)
      event.returnValue = value
    } catch(e) {
      log.error(e)
      event.returnValue = undefined
    }
  })

  ipcMain.handle('config.get', async (event, key) => {
    const value = await getConfig(key)
    log.verbose(`ipcMain: config.get ${key}: ${value}`)
    return value
  })

  ipcMain.handle('config.set', async (event, key, currentValue, value) => {
    // This keeps the values of websites_enable_max_runtime(bool) and websites_max_runtime (number)
    // in sync. Withtout this, `probe-cli` continues to use the number in `websites_max_runtime`
    // even if `websites_enable_max_runtime` is false (unchecked).
    if (key === 'nettests.websites_enable_max_runtime') {
      const maxRuntimeCurrentValue = await getConfig('nettests.websites_max_runtime')
      const maxRuntimeNewValue = value === true ? 90 : 0
      await setConfig('nettests.websites_max_runtime', maxRuntimeCurrentValue, maxRuntimeNewValue)
    }

    const newConfig = await setConfig(key, currentValue, value)
    return newConfig
  })

  ipcMain.handle('get-fresh-config', async () => {
    return await getConfig()
  })
  
  ipcMain.handle('reset', async () => {
    const { hardReset } = require('./actions')
    try {
      await hardReset()
      return true
    } catch (e) {
      log.error(`Hard reset failed: ${e.message}`)
      return false
    }
  })

  ipcMain.on('debugGetAllPaths', (event) => {
    const { debugGetAllPaths } = require('./utils/paths')
    event.returnValue = debugGetAllPaths()
  })

  ipcMain.on('config.categories', (event) => {
    const { availableCategoriesList } = require('./utils/config')
    event.returnValue = availableCategoriesList
  })

}

module.exports = {
  inputFileRequest,
  inputFileResponse,
  lastResultRequest,
  lastResultResponse,
  ipcBindingsForMain
}
