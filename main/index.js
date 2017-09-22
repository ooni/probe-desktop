// Native
const { format } = require('url')

const { spawn } = require('child_process')

const MK_BIN = '../measurement-kit/measurement_kit'

// Packages
const { BrowserWindow, app, ipcMain } = require('electron')
const isDev = require('electron-is-dev')
const prepareNext = require('electron-next')
const { resolve } = require('app-root-path')

// Prepare the renderer once the app is ready
app.on('ready', async () => {
  await prepareNext('./renderer')

  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600
  })

  const devPath = 'http://localhost:8000/home'

  const prodPath = format({
    pathname: resolve('renderer/out/home/index.html'),
    protocol: 'file:',
    slashes: true
  })

  const url = isDev ? devPath : prodPath
  mainWindow.loadURL(url)
})

ipcMain.on('start-test', (e, arg) => {
  const testID = 1234
  console.log('got start-test', arg)
  let mkArgs = [
    '-v',
    'web_connectivity',
    '-u',
    'http://ooni.io'
  ]
  const mk = spawn(MK_BIN, mkArgs)

  mk.stdout.on('data', data => {
    console.log(data.toString())
    e.sender.send('test-output', data.toString())
  })

  mk.stderr.on('data', data => {
    console.log(data.toString())
    e.sender.send('test-output', data.toString())
  })

  mk.on('close', (code) => {
    e.sender.send('test-done', code)
  })

})

// Quit the app once all windows are closed
app.on('window-all-closed', app.quit)
