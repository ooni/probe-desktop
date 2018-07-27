import React from 'react'

import moment from 'moment'

import {
  Text,
  Container,
  Flex,
  Box,
  Heading
} from 'ooni-components'

import styled from 'styled-components'

import IconUpload from 'react-icons/lib/md/file-upload'
import IconDownload from 'react-icons/lib/md/file-download'

import MdFlag from 'react-icons/lib/md/flag'
import MdTimer from 'react-icons/lib/md/timer'
import MdSwapVert from 'react-icons/lib/md/swap-vert'
import MdPublic from 'react-icons/lib/md/public'

import { renderDetails, testGroups } from '../nettests'
import TwoColumnHero from './TwoColumnHero'
import TwoColumnTable from './TwoColumnTable'
import BackButton from './BackButton'

const MeasurementOverviewContainer = styled.div`
  position: relative;
  width: 100%;
  color: ${props => props.theme.colors.white};
`

// XXX There is a lot of duplication with ./TestResultDetails.ResultOverview
const MeasurementOverview = ({title, startTime, runtime, networkName, country, asn}) => {
  return (
    <MeasurementOverviewContainer>
      <Flex justify='center' align='center'>
        <Box>
          <BackButton />
        </Box>
        <Box w={1}>
          <Heading center h={3}>{title}</Heading>
        </Box>
      </Flex>
      <Container>

        <TwoColumnTable
          left={<Text><MdSwapVert size={20} />Date</Text>}
          right={<Text>{startTime && moment(startTime).format('lll')}</Text>} />

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
    </MeasurementOverviewContainer>
  )
}

const mapOverviewProps = (msmt) => {
  const groupName = msmt.result_name || 'default'
  let props = {
    groupName,
    group: testGroups[groupName],
  }
  if (!msmt) {
    return props
  }
  props = {
    ...props,
    title: msmt.measurement_name,
    startTime: msmt.start_time || null,
    dataUsageUp: msmt.data_usage_upi || 0,
    dataUsageDown: msmt.data_usage_down || 0,
    runtime: msmt.runtime || 0,
    networkName: msmt.network_name || '',
    country: msmt.country || '',
    asn: msmt.asn || '',
  }
  return props
}

const TestResultsDetails = ({measurement}) => {
  const overviewProps = mapOverviewProps(measurement)

  return <TwoColumnHero
    bg={overviewProps.group.color}
    left={<MeasurementOverview {...overviewProps} onBack={() => this.onSelectMeasurement(null)} />}
    right={renderDetails(measurement.measurement_name, measurement.summary)} />
}

export default TestResultsDetails
