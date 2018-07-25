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
import IoSpeedometer from 'react-icons/lib/io/speedometer'
import FormattedMarkdownMessage from './FormattedMarkdownMessage'

const iconSize = 200
const iconColor = theme.colors.black

const DescriptionContainer = styled.div`
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
  },
  'im': {
    'color': theme.colors.cyan6,
    'name': <FormattedMessage id="Test.InstantMessaging.Fullname" />,
    'description': <FormattedMarkdownMessage id="Dashboard.InstantMessaging.Card.Description" />,
    'longDescription': <LongDescription name='InstantMessaging' />,
    'icon': <NettestGroupInstantMessaging />,
  },
  'middlebox': {
    'color': theme.colors.violet8,
    'name': <FormattedMessage id="Test.Middleboxes.Fullname" />,
    'description': <FormattedMarkdownMessage id="Dashboard.Middleboxes.Card.Description" />,
    'longDescription': <LongDescription name='Middleboxes' />,
    'icon': <NettestGroupMiddleBoxes />,
  },
  'performance': {
    'color': theme.colors.fuschia6,
    'name': <FormattedMessage id="Test.Performance.Fullname" />,
    'description': <FormattedMarkdownMessage id="Dashboard.Performance.Card.Description" />,
    'longDescription': <LongDescription name='Performance' />,
    'icon': <NettestGroupPerformance />,
  },
  'default': {
    'color': theme.colors.blue5,
    'description': '',
    'longDescription': '',
    'name': 'Default',
    'icon': <IoSpeedometer />,
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
