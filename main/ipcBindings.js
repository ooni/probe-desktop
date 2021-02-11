const { app } = require('electron')
const fs = require('fs-extra')
const { listResults } = require('./actions')
const { Runner } = require('./utils/ooni/run')
const onboard = require('./utils/ooni/onboard')

// BUG: The idea *was* to use these constants across main and renderer processes
// to wire up the IPC channels. But importing these directly from renderer
// scripts throws this error: https://github.com/sindresorhus/electron-util/issues/27
const inputFileRequest = 'fs.write.request'
const inputFileResponse = 'fs.write.response'
const lastResultRequest = 'results.last.request'
const lastResultResponse = 'results.last.response'

let testRunner = null
let stopRequested = false

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
    const results = await listResults()
    if (results.hasOwnProperty('rows') && results.rows.length > 0) {
      const filteredRows = results.rows.filter(row =>
        testGroupName !== 'all' ? row.name === testGroupName : true
      )
      lastTested = filteredRows.length > 0
        ? filteredRows[filteredRows.length - 1].start_time
        : null
    }
    event.reply(lastResultResponse, {
      lastResult: lastTested
    })
  })

  ipcMain.on('ooniprobe.run', async (event, { testGroupToRun, inputFile }) => {
    const sender = event.sender
    // TODO: Should figure out a way to share this list between main and renderer
    // Cannot import `testGroups` as-is from 'renderer/components/nettests/index.js'
    const supportedTestGroups = ['websites', 'circumvention', 'im', 'middlebox', 'performance']
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

  ipcMain.handle('config.onboard', async (event, { optout = false }) => {
    await onboard({ optout })
  })
}

module.exports = {
  inputFileRequest,
  inputFileResponse,
  lastResultRequest,
  lastResultResponse,
  ipcBindingsForMain
}
