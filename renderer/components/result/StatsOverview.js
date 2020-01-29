import React from 'react'

import { FormattedMessage } from 'react-intl'

import VerticalDivider from '../to-migrate/VerticalDivider'
import StatBox from '../to-migrate/StatBox'

import {
  NettestGroupMiddleBoxes,
} from 'ooni-components/dist/icons'

import {
  Flex,
  Box,
  Text
} from 'ooni-components'

import formatBitrate from '../formatBitrate'
import formatSpeed from '../formatSpeed'

const addPlurality = (id, count) => {
  if (parseInt(count) === 0 || parseInt(count) > 1) {
    return `${id}.Plural`
  }
  return `${id}.Singular`
}

const WebsitesStats = ({totalCount, anomalyCount}) => {
  const testedCount = totalCount
  const blockedCount = anomalyCount
  const accessibleCount = testedCount - blockedCount

  let testedLabelID = addPlurality('TestResults.Summary.Websites.Hero.Tested', testedCount)
  let blockedLabelID = addPlurality('TestResults.Summary.Websites.Hero.Blocked', blockedCount)
  let accessibleLabelID = addPlurality('TestResults.Summary.Websites.Hero.Reachable', accessibleCount)

  let blockedSitesID = addPlurality('TestResults.Summary.Websites.Hero.Sites', blockedCount)
  let accessibleSitesID = addPlurality('TestResults.Summary.Websites.Hero.Sites', accessibleCount)
  let testedSitesID = addPlurality('TestResults.Summary.Websites.Hero.Sites', testedCount)

  return (
    <Flex style={{width: '100%'}}>
      <Box width={1/3}>
        <StatBox
          value={testedCount}
          unit={<FormattedMessage id={testedSitesID} />}
          label={<FormattedMessage id={testedLabelID} />} />
      </Box>
      <VerticalDivider />
      <Box width={1/3}>
        <StatBox
          value={blockedCount}
          unit={<FormattedMessage id={blockedSitesID} />}
          label={<FormattedMessage id={blockedLabelID} />} />
      </Box>
      <VerticalDivider />
      <Box width={1/3}>
        <StatBox
          value={accessibleCount}
          unit={<FormattedMessage id={accessibleSitesID} />}
          label={<FormattedMessage id={accessibleLabelID} />} />
      </Box>
    </Flex>
  )
}

const IMStats = ({anomalyCount, totalCount}) => {
  const testedCount = totalCount
  const blockedCount = anomalyCount
  const accessibleCount = testedCount - blockedCount

  let testedLabelID = addPlurality('TestResults.Summary.InstantMessaging.Hero.Tested', testedCount)
  let blockedLabelID = addPlurality('TestResults.Summary.InstantMessaging.Hero.Blocked', blockedCount)
  let accessibleLabelID = addPlurality('TestResults.Summary.InstantMessaging.Hero.Reachable', accessibleCount)

  let blockedAppsID = addPlurality('TestResults.Summary.InstantMessaging.Hero.Apps', blockedCount)
  let accessibleAppsID = addPlurality('TestResults.Summary.InstantMessaging.Hero.Apps', accessibleCount)
  let testedAppsID = addPlurality('TestResults.Summary.InstantMessaging.Hero.Apps', testedCount)

  return (
    <Flex style={{width: '100%'}}>
      <Box width={1/3}>
        <StatBox
          value={testedCount}
          unit={<FormattedMessage id={testedAppsID} />}
          label={<FormattedMessage id={testedLabelID} />} />
      </Box>
      <VerticalDivider />
      <Box width={1/3}>
        <StatBox
          value={blockedCount}
          unit={<FormattedMessage id={blockedAppsID} />}
          label={<FormattedMessage id={blockedLabelID} />} />
      </Box>
      <VerticalDivider />
      <Box width={1/3}>
        <StatBox
          value={accessibleCount}
          unit={<FormattedMessage id={accessibleAppsID} />}
          label={<FormattedMessage id={accessibleLabelID} />} />
      </Box>
    </Flex>
  )
}

const MiddleboxStats = ({anomalyCount}) => {
  const detected = anomalyCount > 0
  let msgID = 'TestResults.Summary.Middleboxes.Hero.NotFound'
  if (detected === true) {
    msgID = 'TestResults.Summary.Middleboxes.Hero.Found'
  }

  return (
    <Flex style={{width: '100%'}}>
      <Box width={1}>
        <Flex justifyContent='center' alignItems='center'>
          <Box>
            <NettestGroupMiddleBoxes size={100} />
          </Box>
        </Flex>
        <Text textAlign='center'><FormattedMessage id='Test.Middleboxes.Fullname' /> <FormattedMessage id={msgID} /></Text>
      </Box>
    </Flex>
  )
}


const PerformanceStats = ({testKeys}) => {
  const upload = formatSpeed(testKeys['upload'])
  const download = formatSpeed(testKeys['download'])
  const ping = testKeys['ping']
  const bitrate = testKeys['median_bitrate']

  return (
    <Flex style={{width: '100%'}}>
      <Box width={1/4}>
        <StatBox
          value={formatBitrate(bitrate)}
          unit={<FormattedMessage id='TestResults.Summary.Performance.Hero.Video.Quality' />}
          label={<FormattedMessage id='TestResults.Summary.Performance.Hero.Video' />} />
      </Box>
      <VerticalDivider />
      <Box width={1/4}>
        <StatBox
          value={download.value}
          unit={download.unit}
          label={<FormattedMessage id='TestResults.Summary.Performance.Hero.Download' />} />
      </Box>
      <VerticalDivider />
      <Box width={1/4}>
        <StatBox
          value={upload.value}
          unit={upload.unit}
          label={<FormattedMessage id='TestResults.Summary.Performance.Hero.Upload' />} />
      </Box>
      <VerticalDivider />
      <Box width={1/4}>
        <StatBox
          value={ping.toFixed(1)}
          label={<FormattedMessage id='TestResults.Summary.Performance.Hero.Ping' />}
          unit='ms'
        />
      </Box>
    </Flex>
  )
}

const CircumventionStats = ({anomalyCount, totalCount}) => {
  const testedCount = totalCount
  const blockedCount = anomalyCount
  const accessibleCount = testedCount - blockedCount

  let testedLabelID = addPlurality('TestResults.Summary.Circumvention.Hero.Tested', testedCount)
  let blockedLabelID = addPlurality('TestResults.Summary.Circumvention.Hero.Blocked', blockedCount)
  let accessibleLabelID = addPlurality('TestResults.Summary.Circumvention.Hero.Reachable', accessibleCount)

  let blockedAppsID = addPlurality('TestResults.Summary.Circumvention.Hero.Tools', blockedCount)
  let accessibleAppsID = addPlurality('TestResults.Summary.Circumvention.Hero.Tools', accessibleCount)
  let testedAppsID = addPlurality('TestResults.Summary.Circumvention.Hero.Tools', testedCount)

  return (
    <Flex justifyContent='center'>
      <Box width={1/3}>
        <StatBox
          value={testedCount}
          unit={<FormattedMessage id={testedAppsID} />}
          label={<FormattedMessage id={testedLabelID} />} />
      </Box>
      <VerticalDivider />
      <Box width={1/3}>
        <StatBox
          value={blockedCount}
          unit={<FormattedMessage id={blockedAppsID} />}
          label={<FormattedMessage id={blockedLabelID} />} />
      </Box>
      <VerticalDivider />
      <Box width={1/3}>
        <StatBox
          value={accessibleCount}
          unit={<FormattedMessage id={accessibleAppsID} />}
          label={<FormattedMessage id={accessibleLabelID} />} />
      </Box>
    </Flex>
  )
}

const statsMap = {
  'websites': WebsitesStats,
  'im': IMStats,
  'middlebox': MiddleboxStats,
  'performance': PerformanceStats,
  'circumvention': CircumventionStats
}

const StatsOverview = ({name, anomalyCount, totalCount, testKeys}) => {
  if (name === 'default') {
    return <div />
  }

  const Element = statsMap[name]
  return <Element anomalyCount={anomalyCount} totalCount={totalCount} testKeys={testKeys} />
}

export default StatsOverview
