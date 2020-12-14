const { app } = require('electron')
const fs = require('fs-extra')

const inputFileRequest = 'fs.write.request'
const inputFileResponse = 'fs.write.response'

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
}

module.exports = {
  inputFileRequest,
  inputFileResponse,
  ipcBindingsForMain
}
