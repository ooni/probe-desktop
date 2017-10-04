import { dialog } from 'electron'
import sudo from 'sudo-prompt'
import { resolve as resolvePath } from 'app-root-path'


export const runAsRoot = (command, why) => {
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
