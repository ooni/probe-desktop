const { Ooniprobe } = require('./utils/ooni/ooniprobe')
const { getAutorunHomeDir } = require('./utils/paths')
const log = require('electron-log/main')
const Sentry = require('@sentry/electron/main')

const hardReset = () => {
  const ooniHome = new Ooniprobe()
  const ooniAutorunHome = new Ooniprobe()
  log.info('hardReset: performing a hard reset of the installation')

  return Promise.all([
    ooniHome.call(['reset', '--force']),
    ooniAutorunHome.call(['reset', '--force'], {'OONI_HOME': getAutorunHomeDir()})
  ])
}

const listMeasurements = (resultID) => {
  const ooni = new Ooniprobe()
  let rows = [],
    errors = [],
    summary = {}

  return new Promise((resolve, reject) => {
    ooni.on('data', (data) => {
      if (data.level === 'error') {
        log.error('listMeasurements: error in row', data.message)
        errors.push(data.message)
        return
      }
      switch(data.fields.type) {
      case 'measurement_item':
        rows.push(data.fields)
        break
      case 'measurement_summary':
        summary = data.fields
        break
      default:
        log.debug('extra fields', data.fields)
      }
    })


    ooni
      .call(['list', resultID])
      .then(() => {
        log.debug('returning list', resultID, rows, summary)
        resolve({
          rows,
          summary,
          errors
        })
      })
      .catch(err => reject(err))
  })
}

const listResults = () => {
  const ooni = new Ooniprobe()
  let rows = [],
    errors = [],
    summary = {}

  return new Promise((resolve, reject) => {
    ooni.on('data', (data) => {
      if (data.fields.type === 'result_item'  && data.level === 'error') {
        log.error('listResults: error in row', data.message)
        errors.push(data.fields)
        return
      }

      switch(data.fields.type) {
      case 'result_item':
        rows.push(data.fields)

        // Sort the result_items because probe-cli returns incomplete results
        // first and gets pushed at one end of the array
        rows.sort((resultA, resultB) => (
          new Date(resultA.start_time) - new Date(resultB.start_time)
        ))
        break
      case 'result_summary':
        summary = data.fields
        break
      default:
        log.debug('extra data.fields', data.fields)
      }
    })

    ooni
      .call(['list'])
      .then(() => {
        resolve({
          errors: errors,
          rows: rows,
          testCount: summary.total_tests,
          networkCount: summary.total_networks,
          dataUsageUp: summary.total_data_usage_up,
          dataUsageDown: summary.total_data_usage_down
        })
      })
      .catch(err => reject(err))
  })
}

const showMeasurement = (msmtID) => {
  const ooni = new Ooniprobe()
  let measurement = {}

  return new Promise((resolve, reject) => {
    ooni.on('data', (data) => {
      if (data.level === 'error') {
        log.debug('error: ', data.message)
        Sentry.addBreadcrumb({
          category: 'actions',
          message: data.message,
          level: 'error',
        })
        reject(data.message)
        return
      }

      switch(data.fields.type) {
      case 'measurement_json':
        measurement = data.fields.measurement_json
        break
      default:
        log.error('showMeasurement: extra data.fields', data.fields)
        log.debug('extra data.fields', data.fields)
      }
    })

    ooni
      .call(['show', msmtID])
      .then(() => {
        log.debug(`showing measurement: ${msmtID}`)
        resolve(measurement)
      })
      .catch(err => reject(err))
  })
}

module.exports = {
  listResults,
  listMeasurements,
  showMeasurement,
  hardReset
}
