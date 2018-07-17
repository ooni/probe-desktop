import React from 'react'

import Moment from 'moment'
import { extendMoment } from 'moment-range'
const moment = extendMoment(Moment)

import humanize from 'humanize'

import ResultRow from './ResultRow'

import styled from 'styled-components'

import {
  Box,
  Flex,
  Heading
} from 'ooni-components'

const Count = styled(Box)`
text-align: center;
font-size: 42px;
font-weight: 300;
`

const Unit = styled(Box)`
text-align: center;
font-size: 16px;
`

const TestCount = ({testCount}) => {
  return (
    <Box pr={2} w={1/3}>
      <Flex column>
        <Count>{testCount}</Count>
        <Unit>Tests</Unit>
      </Flex>
    </Box>
  )
}

const NetworkCount = ({networkCount}) => {
  return (
    <Box pr={2} w={1/3}>
      <Flex column>
        <Count>{networkCount}</Count>
        <Unit>Networks</Unit>
      </Flex>
    </Box>
  )
}

const FileUnit = styled.span`
  font-size: 14px;
`

const FileAmount = styled.span`
  font-size: 24px;
  font-weight: 300;
`

const StyledHumanFilesize = styled(Box)`
  padding: 0px;
  text-align: center;
`

const HumanFilesize = ({size}) => {
  const human = humanize.filesize(size)
  const [amount, unit] = human.split(' ')
  return (
    <StyledHumanFilesize>
      <FileAmount>{amount}</FileAmount>
      <FileUnit>{unit}</FileUnit>
    </StyledHumanFilesize>
  )
}
const DataUsage = ({dataUsage}) => {
  return (
    <Box pr={2} w={1/3}>
      <Flex column>
        <Box>
          <Flex column>
            <HumanFilesize size={dataUsage.up} />
            <HumanFilesize size={dataUsage.down} />
          </Flex>
        </Box>
        <Unit>Data</Unit>
      </Flex>
    </Box>
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
      <Flex align='baseline' justify='space-around'>
        <Box w={2/3}>
          <Flex>
            <TestCount testCount={testCount} />
            <NetworkCount networkCount={networkCount} />
            <DataUsage dataUsage={dataUsage} />
          </Flex>
        </Box>
      </Flex>
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
  if (!rows) {
    return []
  }

  // We assume the rows are sorted from newest to oldest
  const start = moment(rows[rows.length - 1].start_time)
  const end = moment()
  let range = moment.range(start, end).snapTo('month')
  let byMonth = {}
  Array.from(range.by('month', { excludeEnd: false})).map(m => {
    byMonth[m.format('YYYY-MM-01')] = []
  })
  rows.map(row => {
    const month = moment(row.start_time).format('YYYY-MM-01')
    byMonth[month].push(row)
  })
  return Object.keys(byMonth).sort().reverse().map(key => [key, byMonth[key]])
}

const FullWidth = styled.div`
  width: 100%;
`

const TestResults = ({results}) => {
  const {
    testCount,
    networkCount,
    dataUsageUp,
    dataUsageDown
  } = results

  const byMonth = groupRowsByMonth(results.rows)

  return (
    <FullWidth>
      <ResultsHeader
        testCount={testCount}
        networkCount={networkCount}
        dataUsage={{up: dataUsageUp, down: dataUsageDown}} />
      {byMonth.map(kv => <ResultsSection key={kv[0]} month={kv[0]} rows={kv[1]} />)}
    </FullWidth>
  )
}

export default TestResults
