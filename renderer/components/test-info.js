import React from 'react'

import {
  theme,
  Text,
  Flex,
  Box
} from 'ooni-components'

// XXX this should be moved to the design-system

import MdClear from 'react-icons/lib/md/clear'
import MdChat from 'react-icons/lib/md/chat'
import MdWeb from 'react-icons/lib/md/web'
import MdComputer from 'react-icons/lib/md/computer'
import MdUnarchive from 'react-icons/lib/md/unarchive'
import IoSpeedometer from 'react-icons/lib/io/speedometer'

const iconSize = 200
const iconColor = theme.colors.black

//
const formatNumber = (n) => {
  return `${n}`
}

const renderWebsitesSummary = (summary) => {
  if (summary == null) {
    return <Text color={theme.colors.red5}>Error</Text>
  }

  return <Flex column>
    <Box w={1}>
      <Text color={theme.colors.red5}><MdClear /> {formatNumber(summary['Blocked'])} blocked</Text>
    </Box>
    <Box w={1}>
      <Text><MdWeb /> {formatNumber(summary['Tested'])} tested</Text>
    </Box>
  </Flex>
}

export const testGroups = {
  'websites': {
    'color': theme.colors.indigo5,
    'name': 'Websites',
    'icon': <MdWeb />,
    renderSummary: renderWebsitesSummary
  },
  'im': {
    'color': theme.colors.cyan6,
    'name': 'Instant Messagging',
    'icon': <MdChat />,
    renderSummary: renderWebsitesSummary
  },
  'middlebox': {
    'color': theme.colors.violet8,
    'name': 'Middlebox',
    'icon': <MdUnarchive />,
    renderSummary: renderWebsitesSummary
  },
  'performance': {
    'color': theme.colors.fuschia6,
    'name': 'Performance',
    'icon': <IoSpeedometer />,
    renderSummary: renderWebsitesSummary
  }
}

const dummyDesc = 'Blocking, nostrud do est, ut occaecat aute blocking, traffic manipulation minim excepteur.'
const dummyLongDesc = 'In, internet in, Tor packet capture, blocking, internet Tor culpa, social media blocking connection reset traffic manipulation. Eu Tor aliquip, dolore network interference TCP, middlebox TLS handshake connection reset ut cupidatat TLS handshake traffic manipulation. Consectetur surveillance non Tor voluptate UDP surveillance DNS tampering ut Tor velit velit packet capture, consequat dolore eiusmod. Adipisicing UDP network interference UDP est Tor, middlebox TLS handshake internet proident, OONI OONI excepteur. Irure sunt, elit internet occaecat, DNS tampering, surveillance deserunt Open Observatory of Network Interference surveillance do.'
export const testList  = ['websites', 'im', 'performance', 'middlebox'].map(key => ({
  name: testGroups[key].name,
  key: key,
  color: testGroups[key].color,
  description: dummyDesc,
  longDescription: dummyLongDesc,
  icon: React.cloneElement(
    testGroups[key].icon,
    {size: iconSize, color: iconColor}
  )
}))
