const sqlite3 = require('sqlite3')//.verbose()
const path = require('path')

const { getHomeDir } = require('./utils/paths')

const OONI_DIR = getHomeDir()
const DB_DIR = path.join(OONI_DIR, 'db')

const db = new sqlite3.Database(path.join(DB_DIR, 'main.sqlite3'))

const listMeasurements = () => {
  return new Promise((resolve, reject) => {
    db.all(`SELECT
	results.name,
	results.start_time,
	results.runtime,
	results.summary,
	results.done,
	measurements.asn,
	measurements.country
FROM results
INNER JOIN measurements ON measurements.result_id = results.id
GROUP BY results.id;`,
  (err, rows) => {
    if (err) {
      return reject(err)
    }
    resolve(result.rows.map(row => ({
      name: row.name,
      network: row.asn,
      asn: row.asn,
      country: row.country,
      date: row.start_time,
      summary: JSON.parse(row.summary)
    })))
  })
  })
}

const listResults = () => {
  return new Promise((resolve, reject) => {
    db.all(`SELECT
	results.name,
	results.start_time,
	results.runtime,
	results.summary,
	results.done,
	measurements.asn,
	measurements.country
FROM results
INNER JOIN measurements ON measurements.result_id = results.id
GROUP BY results.id;`,
  (err, rows) => {
    if (err) {
      return reject(err)
    }
    resolve(rows.map(row => ({
      name: row.name,
      network: row.asn,
      asn: row.asn,
      country: row.country,
      dataUsageUp: row.data_usage_up,
      dataUsageDown: row.data_usage_down,
      date: row.start_time,
      summary: JSON.parse(row.summary)
    })))
  })
  })
}

module.exports = {
  listResults,
  listMeasurements
}
