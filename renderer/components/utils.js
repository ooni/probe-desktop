import log from 'electron-log/renderer'

// export const openInBrowser = (url, event) => {
export const openInBrowser = () => {
  // var shell = require('shell')
  // event.preventDefault()
  // shell.openExternal(url)
}

export const parseTestKeys = (testKeys) => {
  let parsedTestKeys = null
  try {
    parsedTestKeys = JSON.parse(testKeys)
  } catch (e) {
    log.error(`error in parsing testKeys: ${e}; ${testKeys}`)
  }
  return parsedTestKeys
}