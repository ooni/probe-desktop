/* global require */
import React from 'react'

import Raven from 'raven-js'

import Link from 'next/link'
import { withRouter } from 'next/router'

import styled from 'styled-components'

import MdKeyboardArrowLeft from 'react-icons/lib/md/keyboard-arrow-left'

import {
  Text,
  Container,
  Flex
} from 'ooni-components'

import Layout from '../components/Layout'
import Sidebar from '../components/SideBar'
import ErrorView from '../components/ErrorView'
import MeasurementRow from '../components/result/MeasurementRow'
import LoadingOverlay from '../components/LoadingOverlay'


const debug = require('debug')('ooniprobe-desktop.renderer.pages.results')

const LeftColumn = styled.div`
  display: flex;
  flex: 1;
  width: 50%;
  background-color: ${props => props.color || props.theme.colors.blue5};
`

const RightColumn = styled.div`
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

const FloatingBackButtonContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
`

const StyledBackLink = styled.a`
  cursor: pointer;
  color: ${props => props.theme.colors.white};
  &:hover {
    color: ${props => props.theme.colors.gray4};
  }
`

// XXX this is a bit sketchy. There is probably a better way of doing this.
const FloatingBackButton = ({href, onClick}) => {
  if (onClick) {
    return (
      <FloatingBackButtonContainer>
        <StyledBackLink onClick={onClick}>
          <MdKeyboardArrowLeft size={50} />
        </StyledBackLink>
      </FloatingBackButtonContainer>
    )
  }
  return (
    <FloatingBackButtonContainer>
      <Link href={href}>
        <StyledBackLink href={href}>
          <MdKeyboardArrowLeft size={50} />
        </StyledBackLink>
      </Link>
    </FloatingBackButtonContainer>
  )
}

const ResultOverview = ({href, groupName}) => {
  return (
    <div>
      <FloatingBackButton href={href} />
      <Container>
        <Text>Result Overview</Text>
        <Text>{groupName}</Text>
      </Container>
    </div>
  )
}

const MeasurementOverview = ({href, groupName, onBack}) => {
  return (
    <div>
      <FloatingBackButton href={href} onClick={onBack}/>
      <Container>
        <Text>Measurement Overview</Text>
        <Text>{groupName}</Text>
      </Container>
    </div>
  )
}

const MeasurementList = ({measurements, onSelect}) => {
  return (
    <Flex wrap>
      {measurements.map(m => <MeasurementRow key={m.id} measurement={m} onSelect={onSelect} />)}
    </Flex>
  )
}

const MeasurementDetails = ({measurement}) => {
  return (
    <div>
      <pre>
        {JSON.stringify(measurement, null, 2)}
      </pre>
    </div>
  )
}

class Result extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      measurements: [],
      selectedMeasurement: null,
      groupName: null,
      loading: true,
      error: null,
    }
    this.onSelectMeasurement = this.onSelectMeasurement.bind(this)
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

  onSelectMeasurement(measurement) {
    this.setState({
      selectedMeasurement: measurement
    })
  }

  render() {
    const {
      groupName,
      measurements,
      selectedMeasurement,
      loading,
      error
    } = this.state

    const {
      router
    } = this.props

    const resultID = router.query && router.query.id

    let href = '/results'
    if (selectedMeasurement !== null) {
      href = `/result?id=${resultID}`
    }

    return (
      <Layout>
        <Sidebar currentUrl={this.props.url}>
          <LoadingOverlay loading={loading} />

          <MainContainer>

            <LeftColumn>
              {selectedMeasurement
                ? <MeasurementOverview href={href} groupName={groupName} onBack={() => this.onSelectMeasurement(null)} />
                : <ResultOverview href={href} groupName={groupName} />}
            </LeftColumn>

            <RightColumn>
              {selectedMeasurement
                ? <MeasurementDetails measurement={selectedMeasurement} />
                : <MeasurementList measurements={measurements} onSelect={this.onSelectMeasurement} />}
            </RightColumn>

          </MainContainer>
          {error && <ErrorView error={error} />}
        </Sidebar>
      </Layout>
    )
  }
}

export default withRouter(Result)
