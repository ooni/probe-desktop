/* global require */
import electron from 'electron'
import React, { useState, useEffect } from 'react'
import * as Sentry from '@sentry/node'

import Layout from '../components/Layout'
import Sidebar from '../components/Sidebar'
import TestResultsContainer from '../components/test-results/TestResultsContainer'
import ErrorView from '../components/ErrorView'
import LoadingOverlay from '../components/LoadingOverlay'

const debug = require('debug')('ooniprobe-desktop.renderer.pages.results')

const TestResults = () => {
  const [loading, setLoading] = useState(true)
  const [results, setResults] = useState({})
  const [error, setError] = useState(null)

  useEffect(() => {
    const remote = electron.remote
    const { listResults } = remote.require('./actions')

    listResults().then(listedResults => {
      setResults(listedResults)
      setLoading(false)
    }).catch(err => {
      Sentry.captureException(err, {extra: {scope: 'renderer.listResults'}})
      debug('error triggered', err)
      setError(err)
      setLoading(false)
    })
  }, [])

  return (
    <Layout>
      <Sidebar>
        <LoadingOverlay loading={loading} />
        {!loading && <TestResultsContainer results={results} />}
        {error && <ErrorView error={error} />}
      </Sidebar>
    </Layout>
  )
}

export default TestResults
