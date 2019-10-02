import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { Text } from 'rebass'
import {
  Container,
  Flex,
  Box,
  Heading
} from 'ooni-components'
import { FormattedMessage, FormattedDate } from 'react-intl'
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

// TODO: (sarathms) Add rest of the implementations when ready
const detailsMap = {
  web_connectivity: WebConnectivity,
  facebook_messenger: FacebookMessengerDetails
}

const Placeholder = ({ id }) => <Box px={5} py={3} bg='gray3'>{id}</Box>

const HeroItemBox = ({ label, content, ...props }) => (
  <Box p={3} {...props}>
    <Text fontSize={24} fontWeight={300}>{content}</Text>
    <Text fontSize={16} fontWeight={600}>{label}</Text>
  </Box>
)

HeroItemBox.propTypes = {
  label: PropTypes.node,
  content: PropTypes.node
}

const StickyHero = ({
  isSticky,
  bg,
  testName,
  startTime,
  networkName,
  asn
}) => {
  const testFullName = tests[testName].name
  if (isSticky) {
    return (
      <Flex bg={bg} color='white' alignItems='center'>
        <Box><BackButton /></Box>
        <Box><Heading textAlign='center' h={4}>{testFullName}</Heading></Box>
      </Flex>
    )
  } else {
    return (
      <Flex flexWrap='wrap' bg={bg} color='white'>
        <Box width={1}>
          <Flex>
            <Box>
              <BackButton />
            </Box>
            <Box>
              <Heading textAlign='center' h={4}>{testFullName}</Heading>
            </Box>
          </Flex>
        </Box>
        <Box width={1} my={4}>

        </Box>
        <Box width={1}>
          <Flex flexWrap='wrap'>
            <HeroItemBox
              width={1/2}
              label={<FormattedMessage id='TestResults.Summary.Hero.DateAndTime' />}
              content={moment.utc(new Date(startTime)).format('lll')}
            />
            <HeroItemBox
              width={1/2}
              label={<FormattedMessage id='TestResults.Summary.Hero.Network' />}
              content={`${networkName} (AS${asn})`}
            />
          </Flex>
        </Box>
      </Flex>
    )
  }
}

const MeasurementDetailContainer = ({ measurement, ...props }) => {
  const TestDetails = detailsMap[measurement.test_name]
  return (
    <TestDetails measurement={measurement} {...props} />
  )
}

MeasurementDetailContainer.propTypes = {
  measurement: PropTypes.object
}

const MeasurementContainer = ({measurement}) => {
  const overviewProps = mapOverviewProps(measurement)
  const testName = measurement.test_name
  const startTime = measurement.start_time
  const networkName = measurement.network_name
  const asn = measurement.asn

  return (
    <MeasurementDetailContainer
      measurement={measurement}
      render={({
        heroBG,
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
              return (
                <Box style={style}>
                  <StickyHero
                    isSticky={isSticky}
                    bg={heroBG}
                    testName={testName}
                    startTime={startTime}
                    networkName={networkName}
                    asn={asn}
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

MeasurementContainer.propTypes = {
  measurement: PropTypes.object
}

export default MeasurementContainer
