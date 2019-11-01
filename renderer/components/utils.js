/* global require */

export const openInBrowser = (url, event) => {
  var shell = require('electron').shell
  event.preventDefault()
  shell.openExternal(url)
}
