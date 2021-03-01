import React, { useState, useEffect } from 'react'
import electron from 'electron'
import * as Sentry from '@sentry/node'
import { useRouter } from 'next/router'
import Debug from 'debug'

import Layout from '../components/Layout'
import Sidebar from '../components/Sidebar'
import ResultContainer from '../components/result/ResultContainer'
import ErrorView from '../components/ErrorView'
import LoadingOverlay from '../components/LoadingOverlay'

const debug = Debug('ooniprobe-desktop.renderer.pages.result')

const sortMeasurementRows = (rows) => {
  return rows.sort((a, b) => {
    if (a.is_anomaly === b.is_anomaly) {
      return 0
    }
    if (a.is_anomaly) {
      return -1
    }
    return 1
  })
}

const Result = () => {
  const { query } = useRouter()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [measurementRows, setMeasurementRows] = useState([])
  const [measurementSummary, setMeasurementSummary] = useState({})

  const loadMeasurements = (resultID) => {
    debug('listing result_id ', resultID)
    const remote = electron.remote
    const { listMeasurements } = remote.require('./actions')
    return listMeasurements(resultID).then(measurementList => {
      const {
        rows,
        summary
      } = measurementList

      setLoading(false)
      setError(null)
      setMeasurementSummary(summary)
      setMeasurementRows(sortMeasurementRows(rows))

    }).catch(err => {
      Sentry.withScope((scope) => {
        scope.setTag('context', 'renderer.listMeasurements')
        Sentry.captureException(err)
      })
      debug('error triggered', err)
      setError(err)
    })
  }

  useEffect(() =>{
    debug('load data with', query)
    return loadMeasurements(query.resultID)
  }, [query])

  const { resultID } = query
  debug('loading', resultID)

  return (
    <Layout>
      <Sidebar>
        <LoadingOverlay loading={loading} />
        {!loading && <ResultContainer rows={measurementRows} summary={measurementSummary} />}
        {error && <ErrorView error={error} />}
      </Sidebar>
    </Layout>
  )

}

export default Result
