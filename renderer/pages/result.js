import React, { useState, useEffect } from 'react'
// import * as Sentry from '@sentry/node'
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
    return window.electron.results.list(resultID).then(measurementList => {
      const {
        rows,
        summary
      } = measurementList
      setError(null)
      setMeasurementSummary(summary)
      setMeasurementRows(sortMeasurementRows(rows))
    }).catch(err => {
      // Sentry.withScope((scope) => {
      //   scope.setTag('context', 'renderer.listMeasurements')
      //   Sentry.captureException(err)
      // })
      // debug('error triggered', err)
      setError(err)
    }).finally(() => {
      setLoading(false)
    })
  }

  useEffect(() =>{
    debug('load data with', query)
    loadMeasurements(query.resultID)
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
