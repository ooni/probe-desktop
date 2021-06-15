import React, { useCallback, useState } from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import styled from 'styled-components'
import Sticky from 'react-stickynode'
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
  Box
} from 'ooni-components'
import { FormattedDate, FormattedMessage, FormattedNumber } from 'react-intl'

import HumanFilesize from '../HumanFilesize'
import { testGroups } from '../nettests'
import StatsOverview from './StatsOverview'
import MeasurementRow from './MeasurementRow'
import BackButton from '../BackButton'
import TwoColumnTable from '../TwoColumnTable'

const OverviewLabel = ({ icon, label }) => (
  <Flex flexDirection='row' alignItems='center'>
    {icon}
    <Box ml={2}>{label}</Box>
  </Flex>
)

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

const ResultOverview = ({
  groupName,
  testKeys,
  overview,
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
  
  return (
    <>
      <Flex justifyContent='center' alignItems='center'>
        <Box>
          <BackButton />
        </Box>
        <Box width={1}>
          <Heading center h={3}>{startTime && moment(startTime).format('lll')}</Heading>
        </Box>
      </Flex>
      <Container style={{padding: '20px 60px'}}>
        <Box pb={4}>
          <StatsOverview
            name={groupName}
            testKeys={testKeys}
            anomalyCount={anomalyCount}
            totalCount={totalCount}
          />
        </Box>
        <TwoColumnTable
          left={
            <OverviewLabel
              icon={<MdSwapVert size={20} />}
              label={<FormattedMessage id='TestResults.Summary.Hero.DataUsage' />}
            />
          }
          right={
            <Flex>
              <HumanFilesize mx={2} icon={<MdArrowUpward size={20}/>} size={dataUsageUp*1024} fontSize={20} />
              <HumanFilesize icon={<MdArrowDownward size={20}/>} size={dataUsageDown*1024} fontSize={20} />
            </Flex>}
        />
        <TwoColumnTable
          left={
            <OverviewLabel
              icon={<MdTimer size={20} />}
              label={<FormattedMessage id='TestResults.Summary.Hero.Runtime' />}
            />
          }
          right={<Text>
            <FormattedNumber
              value={Number(runtime).toFixed(2)}
              style='unit'
              unit='second'
              unitDisplay='narrow'
            />
          </Text>}
        />
        <TwoColumnTable
          left={
            <OverviewLabel
              icon={<MdFlag size={20} />}
              label={<FormattedMessage id='TestResults.Summary.Hero.Country' />}
            />
          }
          right={<Text>{countryCode}</Text>}
        />
        <TwoColumnTable
          left={
            <OverviewLabel
              icon={<MdPublic  size={20} />}
              label={<FormattedMessage id='TestResults.Summary.Hero.Network' />}
            />
          }
          right={<Text>{networkName} ({asn})</Text>}
        />
      </Container>
    </>
  )
}

ResultOverview.propTypes = {
  overview: overviewShape,
  testKeys: PropTypes.object,
  groupName: PropTypes.string,
  isSticky: PropTypes.bool
}

const FadeInFlex = styled(Flex)`
  opacity: ${props => props.isSticky ? 1 : 0};
  height: ${props => props.isSticky ? '50px' : 0};
  transition-duration: 0.2s;
`

const ResultOverviewCollapsed = ({ overview, ...rest }) => {
  const {
    startTime,
    networkName,
    countryCode,
    asn
  } = overview
  return (
    <FadeInFlex justifyContent='center' alignItems='center' {...rest}>
      <Box>
        <BackButton />
      </Box>
      <Box>
        <Heading center h={4}>{startTime && <FormattedDate value={startTime} />}</Heading>
      </Box>
      <Flex alignItems='center' ml='auto'>
        <MdPublic size={20} />
        <Text mx={1}>{networkName} (AS{asn})</Text>
      </Flex>
      <Flex alignItems='center' mx={2}>
        <MdFlag size={20} />
        <Text mx={1}>{countryCode}</Text>
      </Flex>
    </FadeInFlex>
  )
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
      dataUsageUp: summary?.data_usage_up || 0,
      dataUsageDown: summary?.data_usage_down || 0,
      anomalyCount: summary?.anomaly_count || 0,
      totalCount: summary?.total_count || 0,
      runtime: summary?.total_runtime || 0,
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
  const [isSticky, setIsSticky] = useState(false)
  const overviewProps = mapOverviewProps(rows, summary)
  
  const handleStateChange = useCallback(({ status }) => {
    switch(status) {
    case Sticky.STATUS_FIXED:
      setIsSticky(true)
      break
    case Sticky.STATUS_ORIGINAL:
      setIsSticky(false)
      break
    }
  }, [])

  return (
    <>
      <HeaderContent bg={overviewProps.group.color}>
        <ResultOverview {...overviewProps} />
        <Sticky enabled={true} onStateChange={handleStateChange} innerZ={1}>
          <ResultOverviewCollapsed isSticky={isSticky} bg={overviewProps.group.color} overview={overviewProps.overview} />
        </Sticky>
      </HeaderContent>
      <MeasurementList groupName={overviewProps.groupName} group={overviewProps.group} measurements={rows} />
    </>
  )
}

export default ResultContainer
