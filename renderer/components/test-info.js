import React from 'react'

import { FormattedMessage } from 'react-intl'

import styled from 'styled-components'

import {
  theme,
  Text,
  Flex,
  Box
} from 'ooni-components'

import {
  NettestGroupWebsites,
  NettestGroupInstantMessaging,
  NettestGroupMiddleBoxes,
  NettestGroupPerformance,
} from 'ooni-components/dist/icons'

// XXX this should be moved to the design-system
import MdClear from 'react-icons/lib/md/clear'
import MdWeb from 'react-icons/lib/md/web'
import IoSpeedometer from 'react-icons/lib/io/speedometer'
import FormattedMarkdownMessage from './FormattedMarkdownMessage'

const iconSize = 200
const iconColor = theme.colors.black

const renderWebsitesSummary = (summary) => {
  if (summary == null) {
    return <Text color={theme.colors.red8}>Error</Text>
  }

  return <Flex column>
    <Box w={1}>
      <Text color={theme.colors.red8}><MdClear /> {summary['Blocked']} blocked</Text>
    </Box>
    <Box w={1}>
      <Text><MdWeb /> {summary['Tested']} tested</Text>
    </Box>
  </Flex>
}

const DescriptionContainer = styled.div`
a {
  color: ${props => props.theme.colors.blue5};
  text-decoration: none;
}

a:hover {
  color: ${props => props.theme.colors.blue3};
}
`

const LongDescription = ({name}) => {
  return (
    <DescriptionContainer>
      <FormattedMarkdownMessage id={`Dashboard.${name}.Overview.Paragraph.1`} />
      <FormattedMarkdownMessage id={`Dashboard.${name}.Overview.Paragraph.2`} />
    </DescriptionContainer>
  )
}

export const testGroups = {
  'websites': {
    'color': theme.colors.indigo5,
    'name': <FormattedMessage id="Test.Websites.Fullname" />,
    'description': <FormattedMarkdownMessage id="Dashboard.Websites.Card.Description" />,
    'longDescription': <LongDescription name='Websites' />,
    'icon': <NettestGroupWebsites />,
    renderSummary: renderWebsitesSummary,
  },
  'im': {
    'color': theme.colors.cyan6,
    'name': <FormattedMessage id="Test.InstantMessaging.Fullname" />,
    'description': <FormattedMarkdownMessage id="Dashboard.InstantMessaging.Card.Description" />,
    'longDescription': <LongDescription name='InstantMessaging' />,
    'icon': <NettestGroupInstantMessaging />,
    renderSummary: renderWebsitesSummary,
  },
  'middlebox': {
    'color': theme.colors.violet8,
    'name': <FormattedMessage id="Test.Middleboxes.Fullname" />,
    'description': <FormattedMarkdownMessage id="Dashboard.Middleboxes.Card.Description" />,
    'longDescription': <LongDescription name='Middleboxes' />,
    'icon': <NettestGroupMiddleBoxes />,
    renderSummary: renderWebsitesSummary,
  },
  'performance': {
    'color': theme.colors.fuschia6,
    'name': <FormattedMessage id="Test.Performance.Fullname" />,
    'description': <FormattedMarkdownMessage id="Dashboard.Performance.Card.Description" />,
    'longDescription': <LongDescription name='Performance' />,
    'icon': <NettestGroupPerformance />,
    renderSummary: renderWebsitesSummary,
  },
  'default': {
    'color': theme.colors.blue5,
    'description': '',
    'longDescription': '',
    'name': 'Default',
    'icon': <IoSpeedometer />,
    renderSummary: renderWebsitesSummary,
  }
}

export const testList  = ['websites', 'im', 'performance', 'middlebox'].map(key => ({
  name: testGroups[key].name,
  key: key,
  color: testGroups[key].color,
  description: testGroups[key].description,
  longDescription: testGroups[key].longDescription,
  icon: React.cloneElement(
    testGroups[key].icon,
    {size: iconSize, color: iconColor}
  )
}))
