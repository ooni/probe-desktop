import React from 'react'

import moment from 'moment'

import styled from 'styled-components'

import TwoColumnHero from './TwoColumnHero'

// XXX replace this with the correct icon
import IconUpload from 'react-icons/lib/md/file-upload'
import IconDownload from 'react-icons/lib/md/file-download'

import MdFlag from 'react-icons/lib/md/flag'
import MdTimer from 'react-icons/lib/md/timer'
import MdSwapVert from 'react-icons/lib/md/swap-vert'
import MdPublic from 'react-icons/lib/md/public'

import {
  Heading,
  Text,
  Container,
  Flex,
  Box,
  Divider
} from 'ooni-components'

import { testGroups } from '../test-info'

import StatsOverview from './StatsOverview'
import MeasurementRow from './MeasurementRow'
import BackButton from './BackButton'
import TwoColumnTable from './TwoColumnTable'

const ResultOverviewContainer = styled.div`
  position: relative;
  width: 100%;
  color: ${props => props.theme.colors.white};
`

// XXX groupName is also passed in
const ResultOverview = ({groupName, resultSummary, startTime, dataUsageUp, dataUsageDown, runtime, networkName, country, asn}) => {
  return (
    <ResultOverviewContainer>
      <Flex justify='center' align='center'>
        <Box>
          <BackButton />
        </Box>
        <Box w={1}>
          <Heading center h={3}>{startTime && moment(startTime).format('lll')}</Heading>
        </Box>
      </Flex>
      <Container>

        <StatsOverview name={groupName} summary={resultSummary} />
        <Divider mt={4} mb={4} />

        <TwoColumnTable
          left={<Text><MdSwapVert size={20} />Data Usage</Text>}
          right={<Text><IconUpload /> {dataUsageUp} <IconDownload />{dataUsageDown}</Text>} />

        <TwoColumnTable
          left={<Text><MdTimer size={20} />Total runtime</Text>}
          right={<Text>{runtime.toFixed(2)} s</Text>} />

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

const MeasurementList = ({groupName, measurements}) => {
  return (
    <Flex wrap style={{width: '100%'}}>
      <Box w={1}>
        {measurements.map(m => <MeasurementRow key={m.id} measurement={m} groupName={groupName} />)}
      </Box>
    </Flex>
  )
}

const mapOverviewProps = (measurements) => {
  let msmt = {}
  if (measurements.length > 0) {
    msmt = measurements[0]
  }
  const groupName = msmt.result_name || 'default'
  return {
    groupName,
    group: testGroups[groupName],
    resultSummary: msmt.result_summary && JSON.parse(msmt.result_summary) || {},
    startTime: msmt.start_time || null,
    dataUsageUp: msmt.data_usage_upi || 0,
    dataUsageDown: msmt.data_usage_down || 0,
    runtime: msmt.runtime || 0,
    networkName: msmt.network_name || '',
    country: msmt.country || '',
    asn: msmt.asn || '',
  }
}

const TestResultsOverview = ({ measurements }) => {
  const overviewProps = mapOverviewProps(measurements)
  return (
    <TwoColumnHero
      bg={overviewProps.group.color}
      left={<ResultOverview {...overviewProps} />}
      right={<MeasurementList groupName={overviewProps.groupName} group={overviewProps.group} measurements={measurements} />} />
  )
}

export default TestResultsOverview
