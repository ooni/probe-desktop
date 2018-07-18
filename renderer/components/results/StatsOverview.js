import React from 'react'

import { FormattedMessage } from 'react-intl'

import VerticalDivider from '../to-migrate/VerticalDivider'
import StatBox from '../to-migrate/StatBox'

import {
  Flex,
  Box,
} from 'ooni-components'

const addPlurality = (id, count) => {
  if (parseInt(count) > 1) {
    return `${id}.Plural`
  }
  return `${id}.Singular`
}

const WebsitesStats = ({summary}) => {
  const testedCount = summary.Tested
  const blockedCount = summary.Blocked
  const accessibleCount = testedCount - blockedCount

  let testedLabelID = addPlurality('TestResults.Summary.Websites.Hero.Tested', testedCount)
  let blockedLabelID = addPlurality('TestResults.Summary.Websites.Hero.Blocked', blockedCount)
  let accessibleLabelID = addPlurality('TestResults.Summary.Websites.Hero.Reachable', accessibleCount)

  let blockedSitesID = addPlurality('TestResults.Summary.Websites.Hero.Sites', blockedCount)
  let accessibleSitesID = addPlurality('TestResults.Summary.Websites.Hero.Sites', accessibleCount)
  let testedSitesID = addPlurality('TestResults.Summary.Websites.Hero.Sites', testedCount)

  return (
    <Flex style={{width: '100%'}}>
      <Box w={1/3}>
        <StatBox
          value={testedCount}
          unit={<FormattedMessage id={testedSitesID} />}
          label={<FormattedMessage id={testedLabelID} />} />
      </Box>
      <VerticalDivider />
      <Box w={1/3}>
        <StatBox
          value={blockedCount}
          unit={<FormattedMessage id={blockedSitesID} />}
          label={<FormattedMessage id={blockedLabelID} />} />
      </Box>
      <VerticalDivider />
      <Box w={1/3}>
        <StatBox
          value={accessibleCount}
          unit={<FormattedMessage id={accessibleSitesID} />}
          label={<FormattedMessage id={accessibleLabelID} />} />
      </Box>
    </Flex>
  )
}

const TODOStats = ({summary}) => {
  return (
    <Flex>
      {JSON.stringify(summary, null, 2)}
    </Flex>
  )
}


const IMStats = ({summary}) => {
  const testedCount = summary.Tested
  const blockedCount = summary.Blocked
  const accessibleCount = testedCount - blockedCount

  let testedLabelID = addPlurality('TestResults.Summary.InstantMessaging.Hero.Tested', testedCount)
  let blockedLabelID = addPlurality('TestResults.Summary.InstantMessaging.Hero.Blocked', blockedCount)
  let accessibleLabelID = addPlurality('TestResults.Summary.InstantMessaging.Hero.Reachable', accessibleCount)

  let blockedAppsID = addPlurality('TestResults.Summary.InstantMessaging.Hero.Apps', blockedCount)
  let accessibleAppsID = addPlurality('TestResults.Summary.InstantMessaging.Hero.Apps', accessibleCount)
  let testedAppsID = addPlurality('TestResults.Summary.InstantMessaging.Hero.Apps', testedCount)

  return (
    <Flex style={{width: '100%'}}>
      <Box w={1/3}>
        <StatBox
          value={testedCount}
          unit={<FormattedMessage id={testedAppsID} />}
          label={<FormattedMessage id={testedLabelID} />} />
      </Box>
      <VerticalDivider />
      <Box w={1/3}>
        <StatBox
          value={blockedCount}
          unit={<FormattedMessage id={blockedAppsID} />}
          label={<FormattedMessage id={blockedLabelID} />} />
      </Box>
      <VerticalDivider />
      <Box w={1/3}>
        <StatBox
          value={accessibleCount}
          unit={<FormattedMessage id={accessibleAppsID} />}
          label={<FormattedMessage id={accessibleLabelID} />} />
      </Box>
    </Flex>
  )
}

const MiddleboxStats = TODOStats
const PerformanceStats = TODOStats

const statsMap = {
  'websites': WebsitesStats,
  'im': IMStats,
  'middlebox': MiddleboxStats,
  'performance': PerformanceStats
}

const StatsOverview = ({name, summary}) => {
  if (name === 'default') {
    return <div />
  }

  const Element = statsMap[name]
  return <Element summary={summary} />
}

export default StatsOverview
