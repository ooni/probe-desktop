/* global require, module */
const { Ooniprobe } = require('./utils/ooni/ooniprobe')

const debug = require('debug')('ooniprobe-desktop.main.actions')

const hardReset = () => {
  const ooni = new Ooniprobe()
  return ooni.call(['reset', '--force'])
}

const listMeasurements = (resultID) => {
  const ooni = new Ooniprobe()
  let rows = [],
    errors = [],
    summary = {}

  return new Promise((resolve, reject) => {
    ooni.on('data', (data) => {
      if (data.level === 'error') {
        errors.push(data.message)
        debug('error in row', data.message)
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
        debug('extra fields', data.fields)
      }
    })


    ooni
      .call(['list', resultID])
      .then(() => {
        debug('returning list', resultID, rows, summary)
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
    summary = {}

  return new Promise((resolve, reject) => {
    ooni.on('data', (data) => {
      if (data.level === 'error') {
        debug('error: ', data.message)
        reject(data.message)
        return
      }
      switch(data.fields.type) {
      case 'result_item':
        rows.push(data.fields)
        break
      case 'result_summary':
        summary = data.fields
        break
      default:
        debug('extra data.fields', data.fields)
      }
    })

    ooni
      .call(['list'])
      .then(() => {
        resolve({
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
        debug('error: ', data.message)
        reject(data.message)
        return
      }

      switch(data.fields.type) {
      case 'measurement_json':
        measurement = data.fields.measurement_json
        break
      default:
        debug('extra data.fields', data.fields)
      }
    })

    ooni
      .call(['show', msmtID])
      .then(() => {
        debug(`showing measurement: ${msmtID}`)
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
