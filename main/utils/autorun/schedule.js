const scheduleAutorun = () => {
  const autorunTask = require('./task')
  return autorunTask.create()
}

module.exports = scheduleAutorun