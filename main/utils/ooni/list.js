const {
  Measurement,
  Result
} = require('../../config/db')

export const listMeasurements = async () => {
  const result = Measurement.findAndCountAll({group: 'reportId'})
  return result.rows.map(row => ({
      name: row.name,
      network: row.asn,
      asn: row.asn,
      country: row.country,
      date: row.startTime,
      summary: row.summary
  }))
}

export const listResults = async () => {
  const result = await Result.findAndCountAll()
  const results = await Promise.all(result.rows.map(async (row) => {
    const measurements = await row.getMeasurements()
    return {
      name: row.name,
      network: measurements[0].asn,
      asn: measurements[0].asn,
      country: measurements[0].country,
      dataUsageUp: row.dataUsageUp,
      dataUsageDown: row.dataUsageDown,
      date: row.startTime,
      summary: row.summary
    }
  }))
  return results
}

module.exports = {
  listResults,
  listMeasurements
}
