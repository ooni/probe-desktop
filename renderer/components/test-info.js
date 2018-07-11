import React from 'react'

import Link from 'next/link'

import {
  theme,
  Text,
  Flex,
  Box
} from 'ooni-components'

import styled from 'styled-components'
import RightArrow from './RightArrow'

// XXX this should be moved to the design-system

import MdCheck from 'react-icons/lib/md/check'
import MdClear from 'react-icons/lib/md/clear'
import MdChat from 'react-icons/lib/md/chat'
import MdWeb from 'react-icons/lib/md/web'
import MdComputer from 'react-icons/lib/md/computer'
import MdUnarchive from 'react-icons/lib/md/unarchive'
import IoSpeedometer from 'react-icons/lib/io/speedometer'

const iconSize = 200
const iconColor = theme.colors.black

const renderWebsitesSummary = (summary) => {
  if (summary == null) {
    return <Text color={theme.colors.red5}>Error</Text>
  }

  return <Flex column>
    <Box w={1}>
      <Text color={theme.colors.red5}><MdClear /> {summary['Blocked']} blocked</Text>
    </Box>
    <Box w={1}>
      <Text><MdWeb /> {summary['Tested']} tested</Text>
    </Box>
  </Flex>
}

const BorderedRow = styled(Flex)`
  width: 100%;
  padding-top: 20px;
  padding-bottom: 20px;
  border-bottom: 1px solid ${props => props.theme.colors.gray3};
`

const VerticalCenter = ({children}) => {
  return (
    <Flex justify='center' align='center' style={{height: '100%'}}>
      <Box>
        {children}
      </Box>
    </Flex>
  )
}

const Status = ({blocked}) => {
  if (blocked === false) {
    return <MdCheck size={30} color={theme.colors.green5} />
  }
  if (blocked === true) {
    return <MdClear size={30} color={theme.colors.red6} />
  }
  return <Text color={theme.colors.red5}>Error ({blocked})</Text>
}

const renderWebsitesMeasurementRow = (measurement, onSelect) => {
  if (measurement == null) {
    return <Text color={theme.colors.red5}>Error</Text>
  }

  const summary = JSON.parse(measurement.summary)
  return (
    <BorderedRow>
      <Box pr={2} pl={2} w={1/8}>
        <MdComputer size={30}/>
      </Box>
      <Box w={6/8} h={1}>
        {measurement.input}
      </Box>
      <Box w={1/8} h={1}>
        <Status blocked={summary.Blocked} />
      </Box>
      <Box w={1/8} style={{marginLeft: 'auto'}} onClick={() => onSelect(measurement)}>
        <VerticalCenter>
          <RightArrow />
        </VerticalCenter>
      </Box>
    </BorderedRow>
  )
}

export const testGroups = {
  'websites': {
    'color': theme.colors.indigo5,
    'name': 'Websites',
    'icon': <MdWeb />,
    renderSummary: renderWebsitesSummary,
    renderMeasurementRow: renderWebsitesMeasurementRow,
  },
  'im': {
    'color': theme.colors.cyan6,
    'name': 'Instant Messagging',
    'icon': <MdChat />,
    renderSummary: renderWebsitesSummary,
    renderMeasurementRow: renderWebsitesMeasurementRow,
  },
  'middlebox': {
    'color': theme.colors.violet8,
    'name': 'Middlebox',
    'icon': <MdUnarchive />,
    renderSummary: renderWebsitesSummary,
    renderMeasurementRow: renderWebsitesMeasurementRow,
  },
  'performance': {
    'color': theme.colors.fuschia6,
    'name': 'Performance',
    'icon': <IoSpeedometer />,
    renderSummary: renderWebsitesSummary,
    renderMeasurementRow: renderWebsitesMeasurementRow,
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
