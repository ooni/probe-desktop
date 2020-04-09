import React from 'react'

import PropTypes from 'prop-types'
import moment from 'moment'

import styled from 'styled-components'

// XXX replace this with the correct icon
import HumanFilesize from '../HumanFilesize'

import {
  MdArrowUpward,
  MdArrowDownward,
  MdFlag,
  MdTimer,
  MdSwapVert,
  MdPublic
} from 'react-icons/md'

import {
  Heading,
  Text,
  Container,
  Flex,
  Box,
  Divider
} from 'ooni-components'
import { FormattedMessage } from 'react-intl'

import { testGroups } from '../nettests'

import StatsOverview from './StatsOverview'
import MeasurementRow from './MeasurementRow'
import BackButton from '../BackButton'
import TwoColumnTable from '../TwoColumnTable'
import { StickyContainer, Sticky } from 'react-sticky'

const ResultOverviewContainer = styled.div`
  position: relative;
  width: 100%;
  color: ${props => props.theme.colors.white};
`

const overviewShape = PropTypes.shape({
  countryCode: PropTypes.string.isRequired,
  networkName: PropTypes.string.isRequired,
  asn: PropTypes.number.isRequired,
  anomalyCount: PropTypes.number.isRequired,
  totalCount: PropTypes.number.isRequired,
  dataUsageUp: PropTypes.number.isRequired,
  dataUsageDown: PropTypes.number.isRequired,
  runtime: PropTypes.number.isRequired,
  startTime: PropTypes.string
})

// XXX groupName is also passed in
const ResultOverview = ({
  groupName,
  testKeys,
  overview,
  isSticky
}) => {
  const {
    anomalyCount,
    totalCount,
    startTime,
    dataUsageUp,
    dataUsageDown,
    runtime,
    networkName,
    countryCode,
    asn
  } = overview

  if (isSticky) {
    return (
      <ResultOverviewContainer>
        <Flex justifyContent='center' alignItems='center'>
          <Box>
            <BackButton />
          </Box>
          <Box>
            <Heading center h={4}>{startTime && moment(startTime).format('lll')}</Heading>
          </Box>
          <Box ml='auto' mr={2}>
            <Flex>
              <Box>
              </Box>
              <Box>
                <Text><MdPublic  size={20} /> {networkName} (AS{asn})</Text>
              </Box>
              <Box>
                <Text><MdFlag size={20} /> {countryCode}</Text>
              </Box>
            </Flex>
          </Box>
        </Flex>
      </ResultOverviewContainer>
    )
  }
  return (
    <ResultOverviewContainer>
      <Flex justifyContent='center' alignItems='center'>
        <Box>
          <BackButton />
        </Box>
        <Box width={1}>
          <Heading center h={3}>{startTime && moment(startTime).format('lll')}</Heading>
        </Box>
      </Flex>
      <Container style={{padding: '20px 60px'}}>

        <StatsOverview
          name={groupName}
          testKeys={testKeys}
          anomalyCount={anomalyCount}
          totalCount={totalCount}
        />
        <Divider mt={4} mb={4} />

        <TwoColumnTable
          left={<Text><MdSwapVert size={20} /><FormattedMessage id='TestResults.Summary.Hero.DataUsage' /></Text>}
          right={<Flex>
            <HumanFilesize icon={<MdArrowUpward size={20}/>} size={dataUsageUp*1024} fontSize={20} />
            <HumanFilesize icon={<MdArrowDownward size={20}/>} size={dataUsageDown*1024} fontSize={20} />
          </Flex>} />

        <TwoColumnTable
          left={<Text><MdTimer size={20} /><FormattedMessage id='TestResults.Summary.Hero.Runtime' /></Text>}
          right={<Text>{runtime.toFixed(2)} s</Text>} />

        <TwoColumnTable
          left={<Text><MdFlag size={20} /><FormattedMessage id='TestResults.Summary.Hero.Country' /></Text>}
          right={<Text>{countryCode}</Text>} />

        <TwoColumnTable
          left={<Text><MdPublic  size={20} /><FormattedMessage id='TestResults.Summary.Hero.Network' /></Text>}
          right={<Text>{networkName} ({asn})</Text>} />
      </Container>
    </ResultOverviewContainer>
  )
}

ResultOverview.propTypes = {
  overview: overviewShape,
  testKeys: PropTypes.object,
  groupName: PropTypes.string,
  isSticky: PropTypes.bool
}

const MeasurementList = ({groupName, measurements}) => {
  return (
    <Flex flexWrap='wrap' style={{width: '100%'}}>
      <Box width={1}>
        {measurements.map(m => <MeasurementRow key={m.id} measurement={m} groupName={groupName} />)}
      </Box>
    </Flex>
  )
}

const mapOverviewProps = (rows, summary) => {
  let msmt = {},
    testKeys = {}
  if (rows.length > 0) {
    msmt = rows[0]
  }
  const groupName = msmt.test_group_name || 'default'
  if (groupName === 'performance') {
    rows.forEach(row => {
      if (row.test_keys) {
        testKeys = Object.assign({}, testKeys, JSON.parse(row.test_keys))
      }
    })
  }
  return {
    groupName,
    group: testGroups[groupName],
    testKeys: testKeys,
    overview: {
      startTime: msmt.start_time || null,
      dataUsageUp: summary.data_usage_up || 0,
      dataUsageDown: summary.data_usage_down || 0,
      anomalyCount: summary.anomaly_count || 0,
      totalCount: summary.total_count || 0,
      runtime: summary.total_runtime || 0,
      networkName: msmt.network_name || '',
      countryCode: msmt.network_country_code || '',
      asn: msmt.asn || 0,
    }
  }
}

const HeaderContent = styled(Box)`
  background-color: ${props => props.bg};
  color: ${props => props.theme.colors.white};
  /* This makes it possible to drag the window around from the side bar */
  -webkit-app-region: drag;
`

const ResultContainer = ({ rows, summary }) => {
  const overviewProps = mapOverviewProps(rows, summary)
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
              <ResultOverview
                isSticky={isSticky}
                {...overviewProps}
              />
            </HeaderContent>
          )
        }}
      </Sticky>
      <MeasurementList groupName={overviewProps.groupName} group={overviewProps.group} measurements={rows} />
    </StickyContainer>
  )
}

export default ResultContainer
