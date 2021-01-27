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

const debug = require('debug')('ooniprobe-desktop.renderer.pages.measurement')

class Measurement extends React.Component {
  static async getInitialProps(ctx) {
    return ctx.query
  }
  constructor(props) {
    super(props)
    this.state = {
      loading: true,
      measurement: {},
      rawMeasurement: {},
      error: null
    }
    this.loadMeasurement = this.loadMeasurement.bind(this)
    this.loadData = this.loadData.bind(this)
    this.loadRawData = this.loadRawData.bind(this)
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

  loadRawData() {
    const { query } = this.props.router
    const remote = electron.remote
    const { showMeasurement } = remote.require('./actions')
    return showMeasurement(query.measurementID).then(measurement => {
      // Inserting `test_keys` from `ooniprobe show <msmtId>` into
      // `state.measurement` earlier extracted from `ooniprobe list <resultId>`
      // Some test screens need more from the full msmt e.g `targets` in Tor
      this.setState({
        rawData: measurement,
        measurement: {
          ...this.state.measurement,
          test_keys: JSON.stringify(measurement.test_keys)
        }
      })
    }).catch(err => {
      Raven.captureException(err, {extra: {scope: 'renderer.showMeasurement'}})
      debug('error triggered', err)
      return this.setState({
        error: err
      })
    })
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
      error,
      rawData
    } = this.state

    // comes from <MeasurementRow> in the results list
    // converts the boolean in query string to true boolean
    const isAnomaly = this.props.router.query.isAnomaly === 'true'

    return (
      <Layout>
        <Sidebar>
          <LoadingOverlay loading={loading} />
          {!loading && <MeasurementContainer
            measurement={measurement}
            isAnomaly={isAnomaly}
            rawData={rawData}
          />}
          {error && <ErrorView error={error} />}
        </Sidebar>
      </Layout>
    )
  }
}

export default withRouter(Measurement)
