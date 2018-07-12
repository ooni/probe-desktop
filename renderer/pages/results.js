/* global require */
import electron from 'electron'
import React from 'react'
import Raven from 'raven-js'

import { withRouter } from 'next/router'

import Layout from '../components/Layout'
import Sidebar from '../components/SideBar'
import TestResultsList from '../components/results/TestResultsList'
import TestResult from '../components/results/TestResult'
import TestResultDetails from '../components/results/TestResultDetails'
import ErrorView from '../components/ErrorView'
import LoadingOverlay from '../components/LoadingOverlay'

const debug = require('debug')('ooniprobe-desktop.renderer.pages.results')

class Results extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      loading: true,
      resultsList: {},
      measurementsList: [],
      selectedMeasurement: null,
      error: null
    }
    this.loadResults = this.loadResults.bind(this)
    this.loadMeasurements = this.loadMeasurements.bind(this)
    this.loadData = this.loadData.bind(this)
  }

  loadMeasurements(resultID) {
    const remote = electron.remote
    const { listMeasurements } = remote.require('./database')
    debug('loadMeasurements', resultID)
    return listMeasurements(resultID).then(measurementsList => {
      debug('measurementsList', measurementsList)
      return this.setState({
        loading: false,
        measurementsList,
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
    const { listResults } = remote.require('./database')

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
          selectedMeasurement: this.state.measurementsList.filter(m => m.id == query.measurementID)[0]
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
      measurementsList,
      selectedMeasurement,
      error
    } = this.state

    const {
      pathname,
      query
    } = this.props.router

    debug('loading', pathname, query)

    if (query.resultID && !query.measurementID) {
      return (
        <Layout>
          <Sidebar currentUrl={this.props.url}>
            <LoadingOverlay loading={loading} />
            <TestResult measurements={measurementsList} />
            {error && <ErrorView error={error} />}
          </Sidebar>
        </Layout>
      )
    }

    if (query.resultID && query.measurementID) {
      return (
        <Layout>
          <Sidebar currentUrl={this.props.url}>
            <LoadingOverlay loading={loading} />
            <TestResultDetails measurement={selectedMeasurement} />
            {error && <ErrorView error={error} />}
          </Sidebar>
        </Layout>
      )
    }

    return (
      <Layout>
        <Sidebar currentUrl={pathname}>
          <LoadingOverlay loading={loading} />
          {!loading && <TestResultsList results={resultsList} />}
          {error && <ErrorView error={error} />}
        </Sidebar>
      </Layout>
    )
  }
}

export default withRouter(Results)
