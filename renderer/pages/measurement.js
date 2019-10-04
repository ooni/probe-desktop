/* global require */
import electron from 'electron'
import React from 'react'
import Raven from 'raven-js'

import { withRouter } from 'next/router'

import Layout from '../components/Layout'
import Sidebar from '../components/Sidebar'
import MeasurementContainer from '../components/measurement/MeasurementContainer'
import ErrorView from '../components/ErrorView'
import LoadingOverlay from '../components/LoadingOverlay'

const debug = require('debug')('ooniprobe-desktop.renderer.pages.results')

class Measurement extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      loading: true,
      measurement: {},
      error: null
    }
    this.loadMeasurement = this.loadMeasurement.bind(this)
    this.loadData = this.loadData.bind(this)
  }

  loadMeasurement(resultID, measurementID) {
    debug('listing result_id ', resultID)
    const remote = electron.remote
    const { listMeasurements } = remote.require('./actions')
    return listMeasurements(resultID).then(measurementList => {
      const {
        rows
      } = measurementList
      // XXX this can maybe be improved
      this.setState({
        loading: false,
        measurement: rows.filter(m => m.id == measurementID)[0]
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
    if (!query.resultID || !query.measurementID) {
      // XXX maybe we should redirect to the listing in this case and show a toast
      throw Error('Missing resultID or measurementID')
    }
    return this.loadMeasurement(query.resultID, query.measurementID)
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
      measurement,
      error
    } = this.state

    const {
      isAnomaly // comes from <MeasurementRow> in the results list
    } = this.props.router.query

    return (
      <Layout>
        <Sidebar>
          <LoadingOverlay loading={loading} />
          {!loading && <MeasurementContainer measurement={measurement} isAnomaly={isAnomaly}/>}
          {error && <ErrorView error={error} />}
        </Sidebar>
      </Layout>
    )
  }
}

export default withRouter(Measurement)
