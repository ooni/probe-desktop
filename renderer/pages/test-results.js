/* global require */
import electron from 'electron'
import React from 'react'
import Raven from 'raven-js'

import { withRouter } from 'next/router'

import Layout from '../components/Layout'
import Sidebar from '../components/Sidebar'
import TestResultsContainer from '../components/test-results/TestResultsContainer'
import ErrorView from '../components/ErrorView'
import LoadingOverlay from '../components/LoadingOverlay'

const debug = require('debug')('ooniprobe-desktop.renderer.pages.results')

class TestResults extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      loading: true,
      results: {},
      error: null
    }
    this.loadResults = this.loadResults.bind(this)
  }

  loadResults() {
    const remote = electron.remote
    const { listResults } = remote.require('./actions')

    return listResults().then(results => {
      return this.setState({
        loading: false,
        results,
      })
    }).catch(err => {
      Raven.captureException(err, {extra: {scope: 'renderer.listResults'}})
      debug('error triggered', err)
      return this.setState({
        error: err
      })
    })
  }

  componentDidMount() {
    this.loadResults()
  }

  componentDidUpdate(prevProps) {
    if (this.props.router.query !== prevProps.router.query) {
      this.loadResults()
    }
  }

  render() {
    const {
      loading,
      results,
      error
    } = this.state

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
}

export default withRouter(TestResults)
