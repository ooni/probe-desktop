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

import MdWeb from 'react-icons/lib/md/web'
import MdDone from 'react-icons/lib/md/done'
import MdClear from 'react-icons/lib/md/clear'
import { testGroups } from '../nettests'
import RightArrow from '../RightArrow'

import UploadSpeed from './UploadSpeed'
import DownloadSpeed from './DownloadSpeed'
import VideoQuality from './VideoQuality'

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
const SummaryContainer = styled(Flex)`
  padding-left: 20px;
  padding-top: 20px;
`

const WebsitesSummary = ({anomalyCount, totalCount}) => {
  return <SummaryContainer wrap>
    <Box w={1}>
      <Text color={theme.colors.red8}><MdClear /> {anomalyCount} blocked</Text>
    </Box>
    <Box w={1}>
      <Text><MdWeb /> {totalCount} tested</Text>
    </Box>
  </SummaryContainer>
}

const IMSummary = ({anomalyCount, totalCount}) => {
  return <SummaryContainer wrap>
    <Box w={1}>
      <Text color={theme.colors.red8}><MdClear /> {anomalyCount} blocked</Text>
    </Box>
    <Box w={1}>
      <Text><MdDone /> {totalCount} tested</Text>
    </Box>
  </SummaryContainer>
}

const PerformanceSummary = ({testKeys}) => {
  return <SummaryContainer wrap>
    <Box w={1/2}>
      <DownloadSpeed bits={testKeys['download']} />
    </Box>
    <Box w={1/2}>
      <VideoQuality bitrate={testKeys['median_bitrate']} />
    </Box>
    <Box w={1/2}>
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
          {this.renderTestKeys()}
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
