import React from 'react'

import Link from 'next/link'
import { withRouter } from 'next/router'

import {
  theme,
  Text,
  Flex,
  Box
} from 'ooni-components'

import styled from 'styled-components'
import RightArrow from '../RightArrow'

// XXX this should be moved to the design-system

import MdCheck from 'react-icons/lib/md/check'
import MdClear from 'react-icons/lib/md/clear'
import MdChat from 'react-icons/lib/md/chat'
import MdWeb from 'react-icons/lib/md/web'
import MdComputer from 'react-icons/lib/md/computer'
import MdUnarchive from 'react-icons/lib/md/unarchive'
import IoSpeedometer from 'react-icons/lib/io/speedometer'

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
    return <MdCheck size={30} color={theme.colors.green7} />
  }
  if (blocked === true) {
    return <MdClear size={30} color={theme.colors.red8} />
  }
  return <Text color={theme.colors.red8}>Error ({blocked})</Text>
}

const MeasurementRow = ({measurement, router}) => {
  if (measurement == null) {
    return <Text color={theme.colors.red8}>Error</Text>
  }

  const summary = JSON.parse(measurement.summary)
  const query = {...router.query, measurementID: measurement.id}
  console.log('query', query)
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
      <Box w={1/8} style={{marginLeft: 'auto'}}>
        <Link href={{pathname: '/results', query}}>
          <a>
            <VerticalCenter>
              <RightArrow />
            </VerticalCenter>
          </a>
        </Link>
      </Box>
    </BorderedRow>
  )
}

export default withRouter(MeasurementRow)
