/* global require */
import React from 'react'

import Raven from 'raven-js'

import moment from 'moment'

import Link from 'next/link'
import { withRouter } from 'next/router'

import styled from 'styled-components'

// XXX replace this with the correct icon
import IconUpload from 'react-icons/lib/md/file-upload'
import IconDownload from 'react-icons/lib/md/file-download'

import MdFlag from 'react-icons/lib/md/flag'
import MdTimer from 'react-icons/lib/md/timer'
import MdSwapVert from 'react-icons/lib/md/swap-vert'
import MdKeyboardArrowLeft from 'react-icons/lib/md/keyboard-arrow-left'
import MdPublic from 'react-icons/lib/md/public'

import {
  Heading,
  Text,
  Container,
  Flex,
  Box
} from 'ooni-components'

import Layout from '../components/Layout'
import Sidebar from '../components/SideBar'
import ErrorView from '../components/ErrorView'
import MeasurementRow from '../components/result/MeasurementRow'
import LoadingOverlay from '../components/LoadingOverlay'

import { testGroups } from '../components/test-info'

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
}

const TwoColumnTable = ({left, right}) => {
  return (
    <Flex align='center' pb={1}>
      <Box>
        {left}
      </Box>
      <Box ml='auto'>
        {right}
      </Box>
    </Flex>
  )
}

const ResultOverviewContainer = styled.div`
  position: relative;
  width: 100%;
  color: ${props => props.theme.colors.white};
`

// XXX groupName is also passed in
const ResultOverview = ({href, startTime, dataUsageUp, dataUsageDown, runtime, networkName, country, asn}) => {
  return (
    <ResultOverviewContainer>
      <Flex justify='center' align='center'>
        <Box>
          <Link href={href}>
            <StyledBackLink href={href}>
              <MdKeyboardArrowLeft size={50} />
            </StyledBackLink>
          </Link>
        </Box>
        <Box w={1}>
          <Heading center h={3}>{startTime && moment(startTime).format('lll')}</Heading>
        </Box>
      </Flex>
      <Container>
        <TwoColumnTable
          left={<Text><MdSwapVert size={20} />Data Usage</Text>}
          right={<Text><IconUpload /> {dataUsageUp} <IconDownload />{dataUsageDown}</Text>} />

        <TwoColumnTable
          left={<Text><MdTimer size={20} />Total runtime</Text>}
          right={<Text>{moment.duration(runtime, 'seconds').humanize()}</Text>} />

        <TwoColumnTable
          left={<Text><MdFlag size={20} />Country</Text>}
          right={<Text>{country}</Text>} />

        <TwoColumnTable
          left={<Text><MdPublic  size={20} />Network</Text>}
          right={<Text>{networkName} ({asn})</Text>} />

      </Container>
    </ResultOverviewContainer>
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

const MeasurementList = ({groupName, measurements, onSelect}) => {
  const group = testGroups[groupName]
  return (
    <Flex wrap style={{width: '100%'}}>
      <Box w={1}>
        {measurements.map(m => React.cloneElement(
          group.renderMeasurementRow(m, onSelect),
          {key: m.id}
        ))}
      </Box>
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
      startTime: null,
      dataUsageUp: 0,
      dataUsageDown: 0,
      runtime: 0,
      networkName: '',
      country: '',
      asn: '',
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
      const msmt = msmts[0]
      this.setState({
        loading: false,
        measurements: msmts,
        startTime: msmt.start_time,
        dataUsageUp: msmt.data_usage_up,
        dataUsageDown: msmt.data_usage_down,
        runtime: msmt.runtime,
        networkName: msmt.network_name,
        country: msmt.country,
        asn: msmt.asn,
        groupName: msmt.result_name
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
      startTime,
      dataUsageUp,
      dataUsageDown,
      runtime,
      networkName,
      country,
      asn,
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

    const overviewProps = {
      href,
      groupName,
      startTime,
      dataUsageUp,
      dataUsageDown,
      runtime,
      networkName,
      country,
      asn
    }
    debug('loading', selectedMeasurement)
    const group = testGroups[groupName] || {}

    return (
      <Layout>
        <Sidebar currentUrl={this.props.url}>
          <LoadingOverlay loading={loading} />

          <MainContainer>

            <LeftColumn color={group.color}>
              {selectedMeasurement
                ? <MeasurementOverview {...overviewProps} onBack={() => this.onSelectMeasurement(null)} />
                : <ResultOverview {...overviewProps} />}
            </LeftColumn>

            <RightColumn>
              {selectedMeasurement
                ? <MeasurementDetails measurement={selectedMeasurement} />
                : <MeasurementList groupName={groupName} measurements={measurements} onSelect={this.onSelectMeasurement} />}
            </RightColumn>

          </MainContainer>
          {error && <ErrorView error={error} />}
        </Sidebar>
      </Layout>
    )
  }
}

export default withRouter(Result)
