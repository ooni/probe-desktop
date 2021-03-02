import { ipcRenderer } from 'electron'
import React, { useEffect, useState, useCallback } from 'react'
import Raven from 'raven-js'
import { useRouter } from 'next/router'
import log from 'electron-log'

import Layout from 'components/Layout'
import Sidebar from 'components/Sidebar'
import MeasurementContainer from 'components/measurement/MeasurementContainer'
import ErrorView from 'components/ErrorView'
import LoadingOverlay from 'components/LoadingOverlay'

const debug = require('debug')('ooniprobe-desktop.renderer.pages.measurement')

const Measurement = () => {

  console.log(log.transports.ipc.level)
  const { query } = useRouter()
  const [loading, setLoading] = useState(true)
  const [measurement, setMeasurement] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    // Upon mount, wait a bit and show prompt about enabling autorun
    ipcRenderer.send('autorun.maybe-remind')
  }, [])

  const loadMeasurement = useCallback((resultID, measurementID) => {
    debug('listing result_id ', resultID)
    ipcRenderer.invoke('list-results', resultID).then(measurementList => {
      const {
        rows
      } = measurementList
      setMeasurement(rows.filter(m => m.id == measurementID)[0])
      setLoading(false)
    }).catch(err => {
      Raven.captureException(err, {extra: {scope: 'renderer.listMeasurements'}})
      debug('error triggered', err)
      setError(err)
    })
  }, [])

  useEffect(() => {
    const {
      resultID = null,
      measurementID = null
    } = query

    if (!resultID || !measurementID) {
      log.debug('Missing resultID or measurementID in query', query)
      return
    }

    loadMeasurement(query.resultID, query.measurementID)
  }, [query, loadMeasurement])

  // comes from <MeasurementRow> in the results list
  // converts the boolean in query string to true boolean
  const isAnomaly = query.isAnomaly === 'true'

  return (
    <Layout>
      <Sidebar>
        {loading && <LoadingOverlay loading={loading} />}
        {!loading && measurement && <MeasurementContainer
          measurement={measurement}
          isAnomaly={isAnomaly}
        />}
        {error && <ErrorView error={error} />}
      </Sidebar>
    </Layout>
  )
}

export default Measurement
