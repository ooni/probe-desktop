/* global require, module */
const fs = require('fs-extra')
const SQL = require('sql.js')

// Load the db
const path = require('path')

const { getHomeDir } = require('./utils/paths')

const OONI_DIR = getHomeDir()
const DB_DIR = path.join(OONI_DIR, 'db')
const MAIN_DB_PATH = path.join(DB_DIR, 'main.sqlite3')

const debug = require('debug')('ooniprobe-desktop.main.database')

debug('database path', MAIN_DB_PATH)

const loadDB = (path) => {
  return new SQL.Database(fs.readFileSync(path))
}

const mapRows = (res) => {
  // Funky js map reduce magic to map column names to rows
  return res[0].values.map(row => {
    return row.reduce((a, v, i) => {
      a[res[0].columns[i]] = v
      return a
    }, {})
  })
}

const listMeasurements = (resultID) => {
  return new Promise((resolve, reject) => {
    const db = loadDB(MAIN_DB_PATH)
    try {
      let rows = mapRows(db.exec(`SELECT
        results.name as result_name,
        results.start_time,
        results.runtime,
        results.summary,
        results.done,
        measurements.id,
        measurements.name as measurement_name,
        measurements.input,
        measurements.uploaded,
        measurements.summary,
        measurements.asn,
        measurements.country,
        results.data_usage_up,
        results.data_usage_down
        FROM results
        INNER JOIN measurements ON measurements.result_id = results.id
        WHERE results.id = ${resultID};`)) // XXX do we care about SQLi?
      resolve(rows)
    } catch (err) {
      debug('got error', err)
      reject(err)
    }
  })
}

const listResults = () => {
  return new Promise((resolve, reject) => {
    const db = loadDB(MAIN_DB_PATH)
    try {
      let rows = mapRows(db.exec(`SELECT
        results.id,
        results.name,
        results.start_time,
        results.runtime,
        results.summary,
        results.done,
        results.network_name,
        results.asn,
        results.country,
        results.data_usage_up,
        results.data_usage_down
        FROM results
        ORDER BY results.start_time DESC;`)),
        networkSet = new Set(),
        dataUsageUp = 0,
        dataUsageDown = 0

      rows.forEach(row => {
        networkSet.add(row.asn)
        dataUsageUp += row.data_usage_up
        dataUsageDown += row.data_usage_down
      })

      resolve({
        rows: rows,
        testCount: rows.length,
        networkCount: networkSet.size,
        dataUsageUp,
        dataUsageDown,
      })
    } catch (err) {
      console.log('got error', err)
      reject(err)
    }
  })
}

module.exports = {
  listResults,
  listMeasurements
}
