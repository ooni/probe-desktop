import React, { useEffect } from 'react'
import { useRouter } from 'next/router'
const debug = require('debug')('ooniprobe-desktop.renderer.components.hooks.useRawData')
import Raven from 'raven-js'

export const useRawData = (msmtID = null) => {
  const [rawData, setRawData] = React.useState(null)
  const [error, setError] = React.useState(null)
  const { query } = useRouter()

  if (!msmtID) {
    msmtID = query.measurementID
  }

  useEffect(() => {
    window.electron.results.showMeasurement(msmtID).then(measurement => {
      setRawData(measurement)
    }).catch(err => {
      Raven.captureException(err, {extra: {scope: 'renderer.showMeasurement'}})
      debug('error in fetching measurement', err)
      setError(err.message)
    })
  }, [msmtID, error])
  return { rawData, error }
}
