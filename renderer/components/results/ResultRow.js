import React from 'react'

import styled from 'styled-components'

import humanize from 'humanize'
import moment from 'moment'

import {
  theme,
  Box,
  Flex,
  Text
} from 'ooni-components'

import Link from 'next/link'

import MdWeb from 'react-icons/lib/md/web'
import MdDone from 'react-icons/lib/md/done'
import MdClear from 'react-icons/lib/md/clear'
import MdArrowDownward from 'react-icons/lib/md/arrow-downward'
import MdArrowUpward from 'react-icons/lib/md/arrow-upward'
import MdVideoLibrary from 'react-icons/lib/md/video-library'
import { testGroups } from '../test-info'
import RightArrow from '../RightArrow'

import formatBitrate from './formatBitrate'

const ColorCode = styled.div`
  height: 80px;
  width: 5px;
  margin-right: 10px;
  margin-top: 1px;
  margin-bottom: 1px;
  background-color: ${props => props.color};
`

const BorderedRow = styled.div`
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


const WebsitesSummary = ({summary}) => {
  return <Flex wrap>
    <Box w={1}>
      <Text color={theme.colors.red8}><MdClear /> {summary['Blocked']} blocked</Text>
    </Box>
    <Box w={1}>
      <Text><MdWeb /> {summary['Tested']} tested</Text>
    </Box>
  </Flex>
}

const IMSummary = ({summary}) => {
  return <Flex wrap>
    <Box w={1}>
      <Text color={theme.colors.red8}><MdClear /> {summary['Blocked']} blocked</Text>
    </Box>
    <Box w={1}>
      <Text><MdDone /> {summary['Tested']} tested</Text>
    </Box>
  </Flex>
}

const formatSpeed = (speed) => {
  if (speed < 1000) {
    return `${speed} kbps`
  }
  if (speed < 1000*1000) {
    return `${(speed / 1000).toFixed(1)} mbps`
  }
  return `${(speed / (1000*1000)).toFixed(1)} gbps`
}

const PerformanceSummary = ({summary}) => {
  return <Flex wrap>
    <Box w={1/2}>
      <Text><MdArrowDownward /> {formatSpeed(summary['Download'])}</Text>
    </Box>
    <Box w={1/2}>
      <Text><MdVideoLibrary /> {formatBitrate(summary['Bitrate'])}</Text>
    </Box>
    <Box w={1/2}>
      <Text><MdArrowUpward /> {formatSpeed(summary['Upload'])}</Text>
    </Box>
  </Flex>
}

const TODOSummary = ({summary}) => {
  return <Flex column>
    {JSON.stringify(summary, null, 2)}
  </Flex>
}

const SummaryError = () => {
  return <Text>Error</Text>
}

const summaryMap = {
  'websites': WebsitesSummary,
  'im': IMSummary,
  'middlebox': TODOSummary,
  'performance': PerformanceSummary
}

const SummaryContainer = styled.div`
  padding-left: 20px;
  padding-top: 20px;
`

class ResultRow extends React.Component {
  constructor (props) {
    super(props)
  }

  renderIcon() {
    const { name } = this.props

    const group = testGroups[name]

    return (
      <Flex justify='center' align='center'>
        <Box w={1/8}>
          <ColorCode color={group.color} />
        </Box>
        <Box w={7/8}>
          <Flex>
            <Box pr={2}>
              {React.cloneElement(
                group.icon,
                {size: 20, color: group.color}
              )}
            </Box>
            <Box>
              <Text color={group.color} bold>{group.name}</Text>
            </Box>
          </Flex>
        </Box>
      </Flex>
    )
  }

  renderNetwork() {
    const {
      asn,
      network,
      country
    } = this.props

    return (
      <VerticalCenter>
        <Text>{network}</Text>
        <Text>AS{asn} ({country})</Text>
      </VerticalCenter>
    )
  }

  renderDate() {
    const {
      start_time
    } = this.props

    return (
      <VerticalCenter>
        <Text>{moment(start_time).format('HH:mm Do MMM')}</Text>
      </VerticalCenter>
    )
  }
  renderSummary() {
    const {
      name,
      summary
    } = this.props

    const summaryObj = JSON.parse(summary)
    let SummaryElement = SummaryError
    if (summaryObj != null) {
      SummaryElement = summaryMap[name]
    }

    return <SummaryContainer>
      <SummaryElement summary={summaryObj} />
    </SummaryContainer>
  }

  render() {
    const {
      resultID
    } = this.props
    return <BorderedRow>
      <Flex>
        <Box pr={2} w={4/16}>
          {this.renderIcon()}
        </Box>
        <Box w={3/16} h={1}>
          {this.renderNetwork()}
        </Box>
        <Box pr={3/16}>
          {this.renderDate()}
        </Box>
        <Box w={4/16} >
          {this.renderSummary()}
        </Box>
        <Box w={1/16} style={{marginLeft: 'auto'}}>
          <VerticalCenter>
            <Link href={{ pathname: '/results', query: {resultID} }} passHref>
              <a>
                <RightArrow />
              </a>
            </Link>
          </VerticalCenter>
        </Box>
      </Flex>
    </BorderedRow>
  }
}

export default ResultRow
