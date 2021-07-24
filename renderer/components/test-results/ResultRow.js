import React from 'react'
import { FormattedDate, FormattedMessage } from 'react-intl'
import styled from 'styled-components'
import {
  theme,
  Box,
  Flex,
  Text
} from 'ooni-components'
import Link from 'next/link'
import { MdWeb, MdDone, MdClear, MdWarning } from 'react-icons/md'
import * as Sentry from '@sentry/electron'

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
  transform: scaleX(${props => props.theme.isRTL ? -1 : 1});
  ${BorderedRow}:hover & {
    color: ${props => props.theme.colors.gray6};
  }
`

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
      <Flex color={anomalyCount > 0 ? theme.colors.red8 : 'unset'} alignItems='center'>
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
      <Flex color={anomalyCount > 0 ? theme.colors.red8 : 'unset'} alignItems='center'>
        <MdClear />&nbsp;<FormattedMessage id='TestResults.Overview.InstantMessaging.Blocked.Plural' values={{ Count: anomalyCount }}/>
      </Flex>
    </Box>
    <Box width={1}>
      <Text>
        <MdDone />&nbsp;<FormattedMessage id='TestResults.Overview.InstantMessaging.Available.Plural' values={{ Count: totalCount - anomalyCount }} />
      </Text>
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

const MiddleboxSummary = ({anomalyCount}) => {
  let msgID = 'TestResults.Summary.Middleboxes.Hero.Failed'
  if (anomalyCount == 0) {
    msgID = 'TestResults.Summary.Middleboxes.Hero.NotFound'
  } else if (anomalyCount > 0) {
    msgID = 'TestResults.Summary.Middleboxes.Hero.Found'
  }

  return (
    <SummaryContainer>
      <Box width={1}>
        <Text>
          <FormattedMessage id={msgID} />
        </Text>
      </Box>
    </SummaryContainer>
  )
}

const CircumventionSummary = ({anomalyCount, totalCount}) => (
  <SummaryContainer flexWrap='wrap'>
    <Box width={1}>
      <Text color={anomalyCount > 0 ? theme.colors.red8 : 'unset'}>
        <MdClear /><FormattedMessage id='TestResults.Overview.Circumvention.Blocked.Plural' values={{ Count: anomalyCount }}/>
      </Text>
    </Box>
    <Box width={1}>
      <Text>
        <MdDone /><FormattedMessage id='TestResults.Overview.Circumvention.Available.Plural' values={{ Count: totalCount - anomalyCount}} />
      </Text>
    </Box>
  </SummaryContainer>
)

const SummaryError = () => (
  <Flex flexDirection='column' justifyContent='center' alignItems='center'>
    <Text color={theme.colors.red8}><FormattedMessage id='TestResults.Overview.Error' /></Text>
  </Flex>
)

const SummaryIncomplete = () => (
  <Flex justifyContent='center' alignItems='center'>
    <MdWarning /> <Text ml={1}><FormattedMessage id='TestResults.Overview.IncompleteResult' /></Text>
  </Flex>
)

const summaryMap = {
  'websites': WebsitesSummary,
  'im': IMSummary,
  'middlebox': MiddleboxSummary,
  'performance': PerformanceSummary,
  'circumvention': CircumventionSummary
}

class ResultRow extends React.Component {
  //TODO This can be easily converted into a funcitonal component
  // with useMemo hooks. Gotta figure out how exception handling works then.
  constructor (props) {
    super(props)
  }

  renderIcon() {
    try {
      const { name } = this.props
      const group = testGroups[name]
      return (
        <Flex alignItems='center'>
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
    } catch (e) {
      Sentry.addBreadcrumb({
        category: 'results',
        message: 'name key is missing in result',
        level: Sentry.Severity.Error
      })
      Sentry.captureException(e)
      return null
    }
  }

  renderNetwork() {
    const {
      asn,
      network_name,
      network_country_code
    } = this.props

    return (
      <Flex flexDirection='column'>
        {network_name && (
          <Text fontWeight='bold'>{network_name}</Text>
        )}
        <Text>{asn && `AS${asn}`} {network_country_code && `(${network_country_code})`}</Text>
      </Flex>
    )
  }

  renderDate() {
    try {
      const {
        start_time
      } = this.props
      return (
        <Flex flexDirection='column' alignItems='center'>
          <Text>
            <FormattedDate value={start_time} dateStyle='long'/>
            {' '}
            <FormattedDate value={start_time} timeStyle='short' />
          </Text>
        </Flex>
      )
    } catch (e) {
      Sentry.addBreadcrumb({
        category: 'results',
        message: 'date key is missing in result',
        level: Sentry.Severity.Error
      })
      Sentry.captureException(e)
      return null
    }
  }

  renderTestKeys() {
    try {
      const {
        name,
        test_keys,
        measurement_anomaly_count,
        measurement_count,
        is_done
      } = this.props
      const testKeys = JSON.parse(test_keys)
      let SummaryElement = SummaryError
      if (!is_done) {
        SummaryElement = SummaryIncomplete
      } else if (testKeys != null) {
        SummaryElement = summaryMap[name]
      }

      return (
        <SummaryElement
          testKeys={testKeys}
          anomalyCount={measurement_anomaly_count}
          totalCount={measurement_count}
        />
      )
    } catch (e) {
      Sentry.addBreadcrumb({
        category: 'results',
        message: 'test_keys is missing in result',
        level: Sentry.Severity.Error
      })
      Sentry.captureException(e)
      return null
    }
  }

  render() {
    const {
      resultID,
    } = this.props
    return <BorderedRow data-testid={`test-result-${this.props.name}`}>
      <Link href={{ pathname: '/result', query: {resultID} }} passHref>
        <Flex alignItems='center'>
          <Box pr={2} width={4/16}>
            {this.renderIcon()}
          </Box>
          <Box width={3/16}>
            {this.renderNetwork()}
          </Box>
          <Box width={3/16}>
            {this.renderDate()}
          </Box>
          <Box width={5/16} mr='auto'>
            {this.renderTestKeys()}
          </Box>
          <Box>
            <RightArrowStyled />
          </Box>
        </Flex>
      </Link>
    </BorderedRow>
  }
}

export default ResultRow
