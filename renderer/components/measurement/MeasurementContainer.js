import React from 'react'

import moment from 'moment'

import {
  Text,
  Container,
  Flex,
  Box,
  Heading
} from 'ooni-components'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'


import {
  IconUpload,
  IconDownload,
  MdFlag,
  MdTimer,
  MdSwapVert,
  MdPublic
} from 'react-icons/md'

import { renderDetails, testGroups, tests } from '../nettests'
import TwoColumnTable from '../TwoColumnTable'
import BackButton from '../BackButton'
import { StickyContainer, Sticky } from 'react-sticky'

import { FacebookMessengerDetails } from '../nettests/im/facebook-messenger'
import { WebConnectivity } from '../nettests/websites/WebConnectivity'

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
          left={<Text><MdSwapVert size={20} /><FormattedMessage id='TestResults.Summary.Hero.DateAndTime' /></Text>}
          right={<Text>{startTime && moment(startTime).format('lll')}</Text>} />

        <TwoColumnTable
          left={<Text><MdTimer size={20} /><FormattedMessage id='TestResults.Summary.Hero.Runtime' /></Text>}
          right={<Text>{runtime.toFixed(2)} s</Text>} />

        <TwoColumnTable
          left={<Text><MdFlag size={20} /><FormattedMessage id='TestResults.Summary.Hero.Country' /></Text>}
          right={<Text>{country}</Text>} />

        <TwoColumnTable
          left={<Text><MdPublic  size={20} /><FormattedMessage id='TestResults.Summary.Hero.Network' /></Text>}
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

const detailsMap = {
  web_connectivity: WebConnectivity,
  facebook_messenger: FacebookMessengerDetails
}

const Placeholder = ({ id }) => <Box px={5} py={3} bg='gray3'>{id}</Box>

const StickyHero = ({isSticky, hero, collapsedHero}) => {
  if (isSticky) {
    return (
      <React.Fragment>
        {collapsedHero}
      </React.Fragment>
    )
  } else {
    return (
      <div>{hero}</div>
    )
  }
}

const MeasurementDetailContainer = ({ measurement, ...props }) => {
  const TestDetails = detailsMap[measurement.test_name]
  return (
    <TestDetails measurement={measurement} {...props} />
  )
}

const MeasurementContainer = ({measurement}) => {
  const overviewProps = mapOverviewProps(measurement)

  return (
    <MeasurementDetailContainer
      measurement={measurement}
      render={({
        hero,
        collapsedHero,
        details
      }) => (
        <StickyContainer>
          <Sticky topOffset={100}>
            {({
              style,
              isSticky
            }) => {
              // TODO: Insert <BackButton /> somewhere on the top
              return (
                <Box style={style}>
                  <StickyHero
                    isSticky={isSticky}
                    hero={hero}
                    collapsedHero={collapsedHero}
                  />
                </Box>
              )
            }}
          </Sticky>
          <Flex my={3} justifyContent='space-around'>
            <Placeholder id='Methodology' />
            <Placeholder id='Runtime: 2s' />
          </Flex>
          {details}
          <Flex my={3} justifyContent='space-around'>
            <Placeholder id='Raw Data' />
            <Placeholder id='Explorer URL' />
            <Placeholder id='View Log' />
          </Flex>
        </StickyContainer>
      )}
    />
  )

}

export default MeasurementContainer
