/* global require */
import React from 'react'

import Raven from 'raven-js'

import { withRouter } from 'next/router'

import styled from 'styled-components'

import {
  Text,
  Container,
  Flex
} from 'ooni-components'

import Layout from '../components/Layout'
import Sidebar from '../components/SideBar'
import ErrorView from '../components/ErrorView'
import MeasurementRow from '../components/result/MeasurementRow'


const debug = require('debug')('ooniprobe-desktop.renderer.pages.results')

const ResultOverview = styled.div`
  display: flex;
  flex: 1;
  width: 50%;
  background-color: ${props => props.color || props.theme.colors.blue5};
`

const MeasurementList = styled.div`
  display: flex;
  overflow: auto;
  flex: 1;
  width: 50%;
`

const MainContainer = styled.div`
  flex: 1;
  display: flex;
  position: relative;
`

class Result extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      measurements: [],
      groupName: null,
      loading: true,
      error: null
    }
  }

  componentDidMount() {
    const {
      router
    } = this.props

    const resultID = router.query && router.query.id
    if (!resultID) {
      return
    }

    const { remote } = require('electron')
    const { listMeasurements } = remote.require('./database')
    debug('fetching', resultID)

    listMeasurements(resultID).then(msmts => {
      debug(msmts)
      this.setState({
        loading: false,
        measurements: msmts,
        groupName: msmts[0].result_name
      })
    }).catch(err => {
      Raven.captureException(err, {extra: {scope: 'renderer.listMeasurements'}})
      debug('error triggered', err)
      this.setState({
        error: err
      })
    })
  }

  render() {
    const {
      groupName,
      measurements,
      loading,
      error
    } = this.state

    return (
      <Layout>
        <Sidebar currentUrl={this.props.url}>
          {loading && <Text>Loading</Text>}

          <MainContainer>

            <ResultOverview>
              <Container>
                <Text>{groupName}</Text>
              </Container>
            </ResultOverview>

            <MeasurementList>
              <Flex wrap>
                {measurements.map(m => <MeasurementRow key={m.id} {...m}/>)}
              </Flex>
            </MeasurementList>

          </MainContainer>
          {error && <ErrorView error={error} />}
        </Sidebar>
      </Layout>
    )
  }
}

export default withRouter(Result)
