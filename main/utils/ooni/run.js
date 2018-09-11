/* global windows, require, module */
const { Ooniprobe } = require('./ooniprobe')

module.exports = async ({testGroupName, options}) => {
  const ooni = new Ooniprobe()
  windows.main.send('starting', testGroupName)
  ooni.on('data', (data) => {
    if (data.level == 'error') {
      windows.main.send('ooni', {
        key: 'error',
        message: data.message
      })
      return
    }

    switch(data.fields.type) {
    case 'progress':
      windows.main.send('ooni', {
        key: 'ooni.run.progress',
        percentage: data.fields.percentage,
        message: data.message,
        testKey: data.fields.key,
      })
      break
    default:
      windows.main.send('ooni', {
        key: 'log',
        value: data.message
      })
    }
  })

  await ooni.call(['run', testGroupName])
}
