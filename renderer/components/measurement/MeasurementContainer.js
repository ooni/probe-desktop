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
import { StickyContainer, Sticky } from 'react-sticky'

const MeasurementOverviewContainer = styled.div`
  position: relative;
  width: 100%;
  color: ${props => props.theme.colors.white};
`

// XXX There is a lot of duplication with ./TestResultDetails.ResultOverview
const MeasurementOverview = ({title, startTime, runtime, networkName, country, asn, isSticky}) => {
  return (
    <MeasurementOverviewContainer>
      <Flex justifyContent='center' alignItems='center'>
        <Box>
          <BackButton />
        </Box>
        <Box width={1}>
          <Heading center h={3}>{startTime && moment(startTime).format('lll')}</Heading>
        </Box>
      </Flex>
      <Container style={{padding: '20px 60px'}}>

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

const HeaderContent = styled(Box)`
  background-color: ${props => props.bg};
  color: ${props => props.theme.colors.white};
  /* This makes it possible to drag the window around from the side bar */
  -webkit-app-region: drag;
`

const MeasurementContainer = ({measurement}) => {
  const overviewProps = mapOverviewProps(measurement)

  return (
    <StickyContainer>
      <Sticky topOffset={100}>
        {({
          style,
          isSticky
        }) => {
          return (
            <HeaderContent
              bg={overviewProps.group.color}
              style={style}>
              <MeasurementOverview
                isSticky={isSticky}
                {...overviewProps}
              />
            </HeaderContent>
          )
        }}
      </Sticky>
      {renderDetails(measurement)}
    </StickyContainer>
  )

}

export default MeasurementContainer
