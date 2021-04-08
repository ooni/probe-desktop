import log from 'electron-log'

export const openInBrowser = (url, event) => {
  var shell = require('electron').shell
  event.preventDefault()
  shell.openExternal(url)
}

export const parseTestKeys = (testKeys) => {
  let parsedTestKeys = null
  try {
    parsedTestKeys = JSON.parse(testKeys)
  } catch (e) {
    log.error(`error in parsing testKeys: ${e}`)
  }
  return parsedTestKeys
}
