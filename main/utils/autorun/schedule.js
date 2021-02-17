const { dialog } = require('electron')

const scheduleAutorun = async ({
  targetWindow,
  dialogTitle = 'Do you want OONI Probe to run automatically every day?',
  dialogMessage = 'OONI Probe can run tests everyday and ...',
  btnYes = 'Yes',
  btnNo = 'No'
}) => {
  const { response } = await dialog.showMessageBox(targetWindow, {
    type: 'question',
    title: dialogTitle,
    message: dialogMessage,
    buttons: [btnNo, btnYes]
  })
  if (response === 1) {
    const autorunTask = require('./task')
    autorunTask.create()
  }
}

module.exports = scheduleAutorun