import React from 'react'
import { useRouter } from 'next/router'
import electron from 'electron'
const debug = require('debug')('ooniprobe-desktop.renderer.components.hooks.useRawData')
import Raven from 'raven-js'

export const useRawData = (msmtID = null) => {
  const [rawData, setRawData] = React.useState(null)
  const [error, setError] = React.useState(null)

  const remote = electron.remote
  const { showMeasurement } = remote.require('./actions')

  if (!msmtID) {
    const { query } = useRouter()
    msmtID = query.measurementID
  }

  React.useEffect(() => {
    showMeasurement(msmtID).then(measurement => {
      setRawData(measurement)
    }).catch(err => {
      Raven.captureException(err, {extra: {scope: 'renderer.showMeasurement'}})
      debug('error triggered', err)
      setError(error)
    })
  }, [])
  return { rawData, error }
}
