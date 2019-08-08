import React from 'react'

import {
  theme
} from 'ooni-components'

import StickyDraggableHeader from '../StickyDraggableHeader'
import Moment from 'moment'
import { extendMoment } from 'moment-range'
const moment = extendMoment(Moment)

import MdArrowDownward from 'react-icons/lib/md/arrow-downward'
import MdArrowUpward from 'react-icons/lib/md/arrow-upward'

import ResultRow from './ResultRow'
import HumanFilesize from '../HumanFilesize'

import styled from 'styled-components'

import {
  Box,
  Flex,
  Container,
  Heading
} from 'ooni-components'

import StatBox from '../to-migrate/StatBox'
import VerticalDivider from '../to-migrate/VerticalDivider'

const LabelBox= styled(Box)`
  font-size: 12px;
  text-align: center;
`

const DataUsage = ({dataUsage}) => {
  return (
    <Flex flexDirection='column'>
      <LabelBox>
      Data Usage
      </LabelBox>
      <Box>
        <Flex>
          <Box width={1/2}>
            <HumanFilesize icon={<MdArrowUpward size={20}/>} size={dataUsage.up*1024} />
          </Box>
          <Box width={1/2}>
            <HumanFilesize icon={<MdArrowDownward size={20} />} size={dataUsage.down*1024} />
          </Box>
        </Flex>
      </Box>
    </Flex>
  )
}

const StyledResultsHeader = styled.div`
  background-color: ${props => props.theme.colors.blue5};
  color: ${props => props.theme.colors.white};
  width: 100%;
  padding-top: 20px;
  padding-bottom: 20px;
`

const ResultsHeader = ({testCount, networkCount, dataUsage}) => {
  return (
    <StyledResultsHeader>
      <Container>
        <Flex>
          <Box width={1/3}>
            <StatBox
              label='Tests'
              value={testCount} />
          </Box>
          <VerticalDivider />
          <Box width={1/3}>
            <StatBox
              label='Networks'
              value={networkCount} />
          </Box>
          <VerticalDivider />
          <Box width={1/3}>
            <DataUsage dataUsage={dataUsage} />
          </Box>
        </Flex>
      </Container>
    </StyledResultsHeader>
  )
}

const MonthContainer = styled.div`
  padding: 5px 20px;
  background-color: ${props => props.theme.colors.gray1};
`

const ResultsSection = ({month, rows}) => {
  return (
    <div>
      <MonthContainer>
        <Heading h={5}>{moment(month).format('MMMM YYYY')}</Heading>
      </MonthContainer>
      {rows.map(row => <ResultRow  key={row.id} resultID={row.id} {...row} />)}
    </div>
  )
}

const groupRowsByMonth = (rows) => {
  if (!rows || rows.length === 0) {
    return []
  }

  // We assume the rows are sorted from oldest to newest
  const start = moment(rows[0].start_time)
  const end = moment()
  let range = moment.range(start, end).snapTo('month')
  let byMonth = {}
  Array.from(range.by('month', { excludeEnd: false})).map(m => {
    byMonth[m.format('YYYY-MM-01')] = []
  })

  // XXX I think there is a better way to do this without so many list
  // reversals.
  rows.reverse().map(row => {
    const month = moment(row.start_time).format('YYYY-MM-01')
    byMonth[month].push(row)
  })
  return Object.keys(byMonth)
    .filter(month => byMonth[month].length > 0 )
    .sort()
    .reverse()
    .map(key => [key, byMonth[key]])
}

const FullWidth = styled.div`
  width: 100%;
`

const TestResultsContainer = ({results}) => {
  const {
    testCount,
    networkCount,
    dataUsageUp,
    dataUsageDown
  } = results

  const byMonth = groupRowsByMonth(results.rows)

  return (
    <FullWidth>
      <StickyDraggableHeader
        color={theme.colors.blue5}
        colorSticky={theme.colors.blue5}
        height='auto'
        header={
          <ResultsHeader
            testCount={testCount}
            networkCount={networkCount}
            dataUsage={{up: dataUsageUp, down: dataUsageDown}} />
        }
      >
        {byMonth.map(kv => <ResultsSection key={kv[0]} month={kv[0]} rows={kv[1]} />)}
      </StickyDraggableHeader>
    </FullWidth>
  )
}

export default TestResultsContainer
