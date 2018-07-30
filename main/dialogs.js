const { dialog } = require('electron')
const sudo = require('sudo-prompt')
const resolvePath = require('app-root-path').resolve

const runAsRoot = (command, why) => {
  const answer = dialog.showMessageBox({
    type: 'question',
    message: 'OONI Probe Needs More Permissions',
    detail: why,
    buttons: ['OK', 'Cancel']
  })
  if (answer === 1) {
    throw new Erorr('Permissions not granted')
  }

  return new Promise((resolve, reject) => {
    const options = {
      name: 'OONI Probe',
      icns: resolvePath('./main/static/icons/mac.icns')
    }
    sudo.exec(command, options, async error => {
      if (error) {
        reject(error)
        return
      }
      resolve()
    })
  })
}

module.exports = {
  runAsRoot
}
