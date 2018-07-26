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
import MdComputer from 'react-icons/lib/md/computer'

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

const formatURL = (url) => {
  if (url.length > 32) {
    return url.substr(0, 31) + '…'
  }
  return url
}

const URLRow =  ({measurement, query, summary}) => (
  <BorderedRow>
    <Box pr={2} pl={2} w={1/8}>
      <MdComputer size={30}/>
    </Box>
    <Box w={6/8} h={1}>
      {formatURL(measurement.input)}
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


// XXX still need to show the summary in here
const TestRow =  ({measurement, query, summary}) => (
  <BorderedRow>
    <Box pr={2} pl={2} w={1/8}>
      <MdComputer size={30}/>
    </Box>
    <Box w={6/8}>
      {measurement.measurement_name}
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

const rowMap = {
  'websites': URLRow,
  'im': TestRow,
  'middlebox': TestRow,
  'performance': TestRow
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

const MeasurementRow = ({groupName, measurement, router}) => {
  if (measurement == null || groupName === 'default') {
    return <Text color={theme.colors.red8}>Error</Text>
  }

  const summary = JSON.parse(measurement.summary)
  const query = {...router.query, measurementID: measurement.id}

  const RowElement = rowMap[groupName]
  return <RowElement measurement={measurement} query={query} summary={summary} />
}

export default withRouter(MeasurementRow)
