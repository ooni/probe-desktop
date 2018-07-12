/* global require */
import React from 'react'

import moment from 'moment'

import styled from 'styled-components'

import BackButton from './BackButton'

import {
  Text,
  Container,
} from 'ooni-components'

import { testGroups } from '../test-info'

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

const MeasurementOverview = ({groupName}) => {
  return (
    <div>
      <BackButton />
      <Container>
        <Text>Measurement Overview</Text>
        <Text>{groupName}</Text>
      </Container>
    </div>
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

const mapOverviewProps = (measurements) => {
  let msmt = {}
  if (msmt.length > 0) {
    msmt = measurements[0]
  }
  const groupName = msmt.result_name || 'default'
  return {
    groupName,
    group: testGroups[groupName],
    startTime: msmt.start_time || null,
    dataUsageUp: msmt.data_usage_upi || 0,
    dataUsageDown: msmt.data_usage_down || 0,
    runtime: msmt.runtime || 0,
    networkName: msmt.network_name || '',
    country: msmt.country || '',
    asn: msmt.asn || '',
  }
}

const TestResultDetails = ({measurement}) => {
  const overviewProps = mapOverviewProps([measurement])
  return (
    <MainContainer>
      <LeftColumn color={overviewProps.group.color}>
        <MeasurementOverview {...overviewProps} onBack={() => this.onSelectMeasurement(null)} />
      </LeftColumn>

      <RightColumn>
        <MeasurementDetails measurement={measurement} />
      </RightColumn>
    </MainContainer>
  )
}

export default TestResultDetails
