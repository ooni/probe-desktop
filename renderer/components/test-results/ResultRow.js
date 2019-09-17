import React from 'react'

import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'

import moment from 'moment'

import {
  theme,
  Box,
  Flex,
  Text
} from 'ooni-components'

import Link from 'next/link'

import { MdWeb, MdDone, MdClear } from 'react-icons/md'
import { testGroups } from '../nettests'
import RightArrow from '../RightArrow'

import UploadSpeed from '../UploadSpeed'
import DownloadSpeed from '../DownloadSpeed'
import VideoQuality from '../VideoQuality'

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
  &:hover {
    background-color: ${props => props.theme.colors.white};
    cursor: pointer;
  }
`

const RightArrowStyled = styled(RightArrow)`
  ${BorderedRow}:hover & {
    color: ${props => props.theme.colors.gray6};
  }
`

const VerticalCenter = ({children}) => {
  return (
    <Flex justifyContent='center' alignItems='center' style={{height: '100%'}}>
      <Box>
        {children}
      </Box>
    </Flex>
  )
}
const SummaryContainer = styled(Flex)`
  padding-left: 20px;
  padding-top: 20px;
`

const WebsitesSummary = ({anomalyCount, totalCount}) => {
  return <SummaryContainer flexWrap='wrap'>
    <Box width={1}>
      <Text color={anomalyCount > 0 ? theme.colors.red8 : theme.colors.black}><MdClear /> {anomalyCount} blocked</Text>
    </Box>
    <Box width={1}>
      <Text><MdWeb /> {totalCount} tested</Text>
    </Box>
  </SummaryContainer>
}

const IMSummary = ({anomalyCount, totalCount}) => {
  return <SummaryContainer flexWrap='wrap'>
    <Box width={1}>
      <Text color={anomalyCount > 0 ? theme.colors.red8 : theme.colors.black}><MdClear /> {anomalyCount} blocked</Text>
    </Box>
    <Box width={1}>
      <Text><MdDone /> {totalCount} tested</Text>
    </Box>
  </SummaryContainer>
}

const PerformanceSummary = ({testKeys}) => {
  return <SummaryContainer flexWrap='wrap'>
    <Box width={1/2}>
      <DownloadSpeed bits={testKeys['download']} />
    </Box>
    <Box width={1/2}>
      <VideoQuality bitrate={testKeys['median_bitrate']} />
    </Box>
    <Box width={1/2}>
      <UploadSpeed bits={testKeys['upload']} />
    </Box>
  </SummaryContainer>
}

const MiddelboxSummary = ({anomalyCount}) => {
  let msgID = 'TestResults.Summary.Middleboxes.Hero.Failed'
  if (anomalyCount == 0) {
    msgID = 'TestResults.Summary.Middleboxes.Hero.NotFound'
  } else if (anomalyCount > 0) {
    msgID = 'TestResults.Summary.Middleboxes.Hero.Found'
  }

  return <VerticalCenter>
    <FormattedMessage id={msgID} />
  </VerticalCenter>
}

const SummaryError = () => {
  return <VerticalCenter>
    <Text color={theme.colors.red8}>Error</Text>
  </VerticalCenter>
}

const summaryMap = {
  'websites': WebsitesSummary,
  'im': IMSummary,
  'middlebox': MiddelboxSummary,
  'performance': PerformanceSummary
}



class ResultRow extends React.Component {
  constructor (props) {
    super(props)
  }

  renderIcon() {
    const { name } = this.props

    const group = testGroups[name]

    return (
      <Flex justifyContent='center' alignItems='center'>
        <Box width={1/8}>
          <ColorCode color={group.color} />
        </Box>
        <Box width={7/8}>
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
      network_country_code
    } = this.props

    return (
      <VerticalCenter>
        <Text>{network}</Text>
        <Text>AS{asn} ({network_country_code})</Text>
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
  renderTestKeys() {
    const {
      name,
      test_keys,
      measurement_anomaly_count,
      measurement_count
    } = this.props

    const testKeys = JSON.parse(test_keys)
    let SummaryElement = SummaryError
    if (testKeys != null) {
      SummaryElement = summaryMap[name]
    }

    return <SummaryElement
      testKeys={testKeys}
      anomalyCount={measurement_anomaly_count}
      totalCount={measurement_count} />
  }

  render() {
    const {
      resultID
    } = this.props
    return <BorderedRow>
      <Link href={{ pathname: '/result', query: {resultID} }} passHref>
        <Flex>
          <Box pr={2} width={4/16}>
            {this.renderIcon()}
          </Box>
          <Box width={3/16} h={1}>
            {this.renderNetwork()}
          </Box>
          <Box pr={3/16}>
            {this.renderDate()}
          </Box>
          <Box width={4/16} >
            {this.renderTestKeys()}
          </Box>
          <Box width={1/16} style={{marginLeft: 'auto'}}>
            <VerticalCenter>
              <RightArrowStyled />
            </VerticalCenter>
          </Box>
        </Flex>
      </Link>
    </BorderedRow>
  }
}

export default ResultRow
