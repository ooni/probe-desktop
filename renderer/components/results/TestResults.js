import React from 'react'

import Moment from 'moment'
import { extendMoment } from 'moment-range'
const moment = extendMoment(Moment)

import MdArrowDownward from 'react-icons/lib/md/arrow-downward'
import MdArrowUpward from 'react-icons/lib/md/arrow-upward'

import humanize from 'humanize'
import ResultRow from './ResultRow'

import styled from 'styled-components'

import {
  Text,
  Box,
  Flex,
  Container,
  Heading
} from 'ooni-components'

import StatBox from '../to-migrate/StatBox'
import VerticalDivider from '../to-migrate/VerticalDivider'

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

const HumanFilesize = ({icon, size}) => {
  const human = humanize.filesize(size)
  const [amount, unit] = human.split(' ')
  return (
    <StyledHumanFilesize>
      {icon}
      <FileAmount>{amount}</FileAmount>
      <FileUnit>{unit}</FileUnit>
    </StyledHumanFilesize>
  )
}

const LabelBox= styled(Box)`
  font-size: 12px;
  text-align: center;
`

const DataUsage = ({dataUsage}) => {
  return (
    <Flex column>
      <LabelBox>
      Data Usage
      </LabelBox>
      <Box>
        <Flex>
          <Box w={1/2}>
            <HumanFilesize icon={<MdArrowUpward size={20}/>} size={dataUsage.up} />
          </Box>
          <Box w={1/2}>
            <HumanFilesize icon={<MdArrowDownward size={20} />} size={dataUsage.down} />
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
      <Container width={700}>
        <Flex>
          <Box w={1/3}>
            <StatBox
              label='Tests'
              value={testCount} />
          </Box>
          <VerticalDivider />
          <Box w={1/3}>
            <StatBox
              label='Networks'
              value={networkCount} />
          </Box>
          <VerticalDivider />
          <Box w={1/3}>
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
