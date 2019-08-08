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
import TwoColumnTable from '../TwoColumnTable'
import BackButton from '../BackButton'
import StickyDraggableHeader from '../StickyDraggableHeader'

const MeasurementOverviewContainer = styled.div`
  position: relative;
  width: 100%;
  color: ${props => props.theme.colors.white};
`

// XXX There is a lot of duplication with ./TestResultDetails.ResultOverview
const MeasurementOverview = ({title, startTime, runtime, networkName, country, asn}) => {
  return (
    <MeasurementOverviewContainer style={{padding: '0 60px'}}>
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
          right={<Text>{networkName} (AS{asn})</Text>} />
      </Container>

    </MeasurementOverviewContainer>
  )
}

const mapOverviewProps = (msmt) => {
  const groupName = msmt.test_group_name || 'default'
  let props = {
    groupName,
    group: testGroups[groupName],
  }
  if (!msmt) {
    return props
  }
  props = {
    ...props,
    title: msmt.test_name,
    startTime: msmt.start_time || null,
    dataUsageUp: msmt.data_usage_up || 0,
    dataUsageDown: msmt.data_usage_down || 0,
    runtime: msmt.runtime || 0,
    networkName: msmt.network_name || '',
    country: msmt.network_country_code || '',
    asn: msmt.asn || '',
  }
  return props
}

const MeasurementContainer = ({measurement}) => {
  const overviewProps = mapOverviewProps(measurement)

  return (
    <StickyDraggableHeader
      color={overviewProps.group.color}
      colorSticky={overviewProps.group.color}
      height='auto'
      header={
        <div>
          <Flex justifyContent='center' alignItems='center'>
            <Box>
              <BackButton />
            </Box>
            <Box width={1}>
              <Heading center h={3}>{overviewProps.title}</Heading>
            </Box>
          </Flex>
          <MeasurementOverview {...overviewProps} onBack={() => this.onSelectMeasurement(null)} />
        </div>
      } >
      {renderDetails(measurement)}
    </StickyDraggableHeader>
  )
}

export default MeasurementContainer
