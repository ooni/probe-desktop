/* global require */
import electron from 'electron'
import React from 'react'
import Raven from 'raven-js'

import { withRouter } from 'next/router'

import Layout from '../components/Layout'
import Sidebar from '../components/Sidebar'
import TestResultsOverview from '../components/result/TestResultsOverview'
import ErrorView from '../components/ErrorView'
import LoadingOverlay from '../components/LoadingOverlay'

const debug = require('debug')('ooniprobe-desktop.renderer.pages.result')

class Result extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      loading: true,
      resultsList: {},
      measurementRows: [],
      measurementSummary: {},
      selectedMeasurement: {},
      error: null
    }
    this.loadMeasurements = this.loadMeasurements.bind(this)
    this.loadData = this.loadData.bind(this)
  }

  loadMeasurements(resultID) {
    debug('listing result_id ', resultID)
    const remote = electron.remote
    const { listMeasurements } = remote.require('./actions')
    return listMeasurements(resultID).then(measurementList => {
      const {
        rows,
        summary
      } = measurementList
      return this.setState({
        loading: false,
        measurementSummary: summary,
        measurementRows: rows
      })
    }).catch(err => {
      Raven.captureException(err, {extra: {scope: 'renderer.listMeasurements'}})
      debug('error triggered', err)
      return this.setState({
        error: err
      })
    })
  }

  loadData() {
    const { query } = this.props.router
    debug('load data with', query)
    return this.loadMeasurements(query.resultID)
  }

  componentDidMount() {
    this.loadData()
  }

  componentDidUpdate(prevProps) {
    if (this.props.router.query !== prevProps.router.query) {
      this.loadData()
    }
  }

  render() {
    const {
      loading,
      measurementRows,
      measurementSummary,
      error
    } = this.state

    const {
      resultID
    } = this.props.router.query

    debug('loading', resultID)

    return (
      <Layout>
        <Sidebar>
          <LoadingOverlay loading={loading} />
          {!loading && <TestResultsOverview rows={measurementRows} summary={measurementSummary} />}
          {error && <ErrorView error={error} />}
        </Sidebar>
      </Layout>
    )

  }
}

export default withRouter(Result)
