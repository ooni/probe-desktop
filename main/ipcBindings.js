const { app } = require('electron')
const fs = require('fs-extra')
const { listResults } = require('./actions')

// BUG: The idea *was* to use these constants across main and renderer processes
// to wire up the IPC channels. But importing these directly from renderer
// scripts throws this error: https://github.com/sindresorhus/electron-util/issues/27
const inputFileRequest = 'fs.write.request'
const inputFileResponse = 'fs.write.response'
const lastResultRequest = 'results.last.request'
const lastResultResponse = 'results.last.response'

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
}

module.exports = {
  inputFileRequest,
  inputFileResponse,
  lastResultRequest,
  lastResultResponse,
  ipcBindingsForMain
}
