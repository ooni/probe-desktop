/* global require */
import electron from 'electron'
import React from 'react'
import Raven from 'raven-js'

import { withRouter } from 'next/router'

import Layout from '../components/Layout'
import Sidebar from '../components/SideBar'
import TestResults from '../components/results/TestResults'
import TestResultsOverview from '../components/results/TestResultsOverview'
import TestResultsDetails from '../components/results/TestResultsDetails'
import ErrorView from '../components/ErrorView'
import LoadingOverlay from '../components/LoadingOverlay'

const debug = require('debug')('ooniprobe-desktop.renderer.pages.results')

const getChildPageName = (query) => {
  if (query.resultID && !query.measurementID) {
    return 'test-results-overview'
  }
  if (query.resultID && query.measurementID) {
    return 'test-results-details'
  }
  return 'test-results'
}

class Results extends React.Component {
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
    this.loadResults = this.loadResults.bind(this)
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

  loadResults() {
    const remote = electron.remote
    const { listResults } = remote.require('./actions')

    return listResults().then(results => {
      return this.setState({
        loading: false,
        resultsList: results,
      })
    }).catch(err => {
      Raven.captureException(err, {extra: {scope: 'renderer.listResults'}})
      debug('error triggered', err)
      return this.setState({
        error: err
      })
    })
  }

  loadData() {
    const { query } = this.props.router
    debug('load data with', query)
    if (query.resultID && !query.measurementID) {
      return this.loadMeasurements(query.resultID)
    }
    if (query.resultID && query.measurementID) {
      // XXX this is a bit sketch
      return this.loadMeasurements(query.resultID).then(() => {
        this.setState({
          selectedMeasurement: this.state.measurementRows.filter(m => m.id == query.measurementID)[0]
        })
      })
    }
    return this.loadResults()
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
      resultsList,
      measurementRows,
      measurementSummary,
      selectedMeasurement,
      error
    } = this.state

    const {
      query
    } = this.props.router


    const childPage = getChildPageName(query)
    debug('loading', query, childPage)

    if (childPage === 'test-results-overview') {
      return (
        <Layout>
          <Sidebar>
            <LoadingOverlay loading={loading} />
            <TestResultsOverview rows={measurementRows} summary={measurementSummary} />
            {error && <ErrorView error={error} />}
          </Sidebar>
        </Layout>
      )
    }

    if (childPage === 'test-results-details') {
      return (
        <Layout>
          <Sidebar>
            <LoadingOverlay loading={loading} />
            <TestResultsDetails measurement={selectedMeasurement} />
            {error && <ErrorView error={error} />}
          </Sidebar>
        </Layout>
      )
    }

    return (
      <Layout>
        <Sidebar>
          <LoadingOverlay loading={loading} />
          {!loading && <TestResults results={resultsList} />}
          {error && <ErrorView error={error} />}
        </Sidebar>
      </Layout>
    )
  }
}

export default withRouter(Results)
