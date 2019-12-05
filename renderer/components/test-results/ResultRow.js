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
  height: 100%;
`

SummaryContainer.defaultProps = {
  flexDirection: 'column',
  justifyContent: 'center',
  width: 2/3,
  mx: 'auto'
}

const WebsitesSummary = ({anomalyCount, totalCount}) => (
  <SummaryContainer>
    <Box>
      <Flex color={anomalyCount > 0 ? theme.colors.red8 : theme.colors.black} alignItems='center'>
        <MdClear />&nbsp;<FormattedMessage id='TestResults.Overview.Websites.Blocked.Plural' values={{ Count: anomalyCount }}/>
      </Flex>
    </Box>
    <Box>
      <Flex alignItems='center'>
        <MdWeb />&nbsp;<FormattedMessage id='TestResults.Overview.Websites.Tested.Plural' values={{ Count: totalCount }} />
      </Flex>
    </Box>
  </SummaryContainer>
)

const IMSummary = ({anomalyCount, totalCount}) => {
  return <SummaryContainer>
    <Box>
      <Flex color={anomalyCount > 0 ? theme.colors.red8 : theme.colors.black} alignItems='center'>
        <MdClear />&nbsp;<FormattedMessage id='TestResults.Overview.InstantMessaging.Blocked.Plural' values={{ Count: anomalyCount }}/>
      </Flex>
    </Box>
    <Box>
      <Flex alignItems='center'>
        <MdDone />&nbsp;<FormattedMessage id='TestResults.Overview.InstantMessaging.Available.Plural' values={{ Count: totalCount }} />
      </Flex>
    </Box>
  </SummaryContainer>
}

const PerformanceSummary = ({testKeys}) => {
  return <SummaryContainer>
    <Box>
      <DownloadSpeed bits={testKeys['download']} />
    </Box>
    <Box>
      <VideoQuality bitrate={testKeys['median_bitrate']} />
    </Box>
    <Box>
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

  return <SummaryContainer>
    <FormattedMessage id={msgID} />
  </SummaryContainer>
}

const SummaryError = () => {
  return <SummaryContainer>
    <Text color={theme.colors.red8}>Error</Text>
  </SummaryContainer>
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
          <Box width={3/16}>
            {this.renderNetwork()}
          </Box>
          <Box width={3/16}>
            {this.renderDate()}
          </Box>
          <Box width={5/16} >
            {this.renderTestKeys()}
          </Box>
          <Box width={1/16} ml='auto'>
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
