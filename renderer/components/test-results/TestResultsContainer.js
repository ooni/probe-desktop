import React from 'react'
import PropTypes from 'prop-types'
import {
  theme
} from 'ooni-components'

import StickyDraggableHeader from '../StickyDraggableHeader'
import Moment from 'moment'
import { extendMoment } from 'moment-range'
const moment = extendMoment(Moment)

import { MdArrowUpward, MdArrowDownward } from 'react-icons/md'

import ResultRow from './ResultRow'
import HumanFilesize from '../HumanFilesize'

import styled from 'styled-components'

import {
  Box,
  Flex,
  Container,
  Heading
} from 'ooni-components'
import { FormattedMessage } from 'react-intl'

import StatBox, { LabelBox } from '../to-migrate/StatBox'
import VerticalDivider from '../to-migrate/VerticalDivider'

const DataUsage = ({ dataUsage }) => {
  return (
    <Flex flexDirection='column' alignItems='center'>
      <LabelBox data-testid='overview-label-data-usage'>
        <FormattedMessage id='TestResults.Overview.Hero.DataUsage' />
      </LabelBox>
      <Flex flexDirection='column'>
        <Box>
          <HumanFilesize fontSize={26} icon={<MdArrowUpward size={22} />} size={dataUsage.up*1024} />
        </Box>
        <Box>
          <HumanFilesize fontSize={26} icon={<MdArrowDownward size={22} />} size={dataUsage.down*1024} />
        </Box>
      </Flex>
    </Flex>
  )
}

DataUsage.propTypes = {
  dataUsage: PropTypes.shape({
    up: PropTypes.number,
    down: PropTypes.number
  })
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
              label={<FormattedMessage id='TestResults.Overview.Hero.Tests' />}
              value={testCount}
              data-testid='overview-label-tests' />
          </Box>
          <VerticalDivider />
          <Box width={1/3}>
            <StatBox
              label={<FormattedMessage id='TestResults.Overview.Hero.Networks' />}
              value={networkCount}
              data-testid='overview-label-networks' />
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

ResultsHeader.propTypes = {
  testCount: PropTypes.number,
  networkCount: PropTypes.number,
  dataUsage: PropTypes.shape({
    up: PropTypes.number,
    down: PropTypes.number
  })
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

ResultsSection.propTypes = {
  month: PropTypes.string,
  rows: PropTypes.arrayOf(PropTypes.object)
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
    // Filter out months with no measurements in them to avoid showing empty months
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
    dataUsageDown,
    rows,
    errors,
  } = results

  // We try to add rows which were reported as errors by probe-cli into
  // the results. Missing fields are handled in `ResultRow`
  const fullRows = rows.concat(errors)

  const byMonth = groupRowsByMonth(fullRows)

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

TestResultsContainer.propTypes = {
  results: PropTypes.shape({
    testCount: PropTypes.number,
    networkCount: PropTypes.number,
    dataUsageUp: PropTypes.number,
    dataUsageDown: PropTypes.number,
    rows: PropTypes.arrayOf(PropTypes.object),
    errors: PropTypes.arrayOf(PropTypes.object)
  })
}

export default TestResultsContainer
