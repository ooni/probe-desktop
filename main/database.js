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

const getAllRows = (db, query) => {
  let res = db.exec(query)
  // Funky js map reduce magic to map column names to rows
  return res[0].values.map(row => {
    return row.reduce((a, v, i) => {
      a[res[0].columns[i]] = v
      return a
    }, {})
  })
}

const listMeasurements = () => {
  return new Promise((resolve, reject) => {
    const db = loadDB(MAIN_DB_PATH)
    try {
      let rows = getAllRows(db, `SELECT
        results.name,
        results.start_time,
        results.runtime,
        results.summary,
        results.done,
        measurements.asn,
        measurements.country,
        results.data_usage_up,
        results.data_usage_down
        FROM results
        INNER JOIN measurements ON measurements.result_id = results.id
        GROUP BY results.id;`)
      resolve(rows)
    } catch (err) {
      console.log('got error', err)
      reject(err)
    }
  })
}

const listResults = () => {
  return new Promise((resolve, reject) => {
    const db = loadDB(MAIN_DB_PATH)
    try {
      let rows = getAllRows(db, `SELECT
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
        FROM results;`),
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
