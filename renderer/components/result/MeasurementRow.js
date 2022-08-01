import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import {
  theme,
  Text,
  Flex,
  Box
} from 'ooni-components'
import { FormattedMessage, useIntl } from 'react-intl'
import {
  Tick
} from 'ooni-components/icons'

import { tests } from '../nettests'
import styled, { css } from 'styled-components'
import RightArrow from '../RightArrow'

import UploadSpeed from '../UploadSpeed'
import DownloadSpeed from '../DownloadSpeed'
import VideoQuality from '../VideoQuality'
import { parseTestKeys } from '../utils'

// XXX this should be moved to the design-system
import { MdPriorityHigh, MdCloudOff } from 'react-icons/md'

import * as OOIcons from 'ooni-components/icons'

const BorderedFlex = styled(Flex)`
  padding-top: 20px;
  padding-bottom: 20px;
  border-bottom: 1px solid ${props => props.theme.colors.gray3};
  ${props => !props.noHover && css`
    &:hover {
      background-color: ${props => props.theme.colors.white};
      cursor: pointer;
    }
  `}
`

const RightArrowStyled = styled(RightArrow)`
  transform: scaleX(${props => props.theme.isRTL ? -1 : 1});
  ${BorderedFlex}:hover & {
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

const formatURL = (url) => {
  if (url.length > 32) {
    return url.substr(0, 31) + '…'
  }
  return url
}

const Status = ({ notok }) => {
  if (notok === false) {
    return <Tick size={30} color={theme.colors.green7} />
  }
  if (notok === true) {
    return <MdPriorityHigh size={30} color={theme.colors.yellow8} />
  }

  return <Text color={theme.colors.red8}>Error ({notok})</Text>
}

const CategoryCode = ({code}) => {
  let iconName = `CategoryCode${code}`
  if (OOIcons[iconName] === undefined) {
    iconName = 'CategoryCodeMISC'
  }
  return React.cloneElement(
    OOIcons[iconName](),
    {size: 30}
  )
}

const NotUploadedNotice = () => {
  const intl = useIntl()
  return (
    <Text as='span' ml={2} color='gray6'
      title={intl.formatMessage({id: 'TestResults.Summary.NoUploaded'})}
    >
      <MdCloudOff size={20} />
    </Text>
  )
}

const URLRow = ({measurement, resultID, measurementID, isAnomaly}) => (
  <Link href={{pathname: `/result/${resultID}/measurement/${measurementID}`, query : {isAnomaly}}}>
    <BorderedFlex data-testid='measured-url-row'>
      <Box pr={2} pl={2} width={1/8}>
        <CategoryCode code={measurement['url_category_code']} />
      </Box>
      <Box width={6/8} h={1}>
        {formatURL(measurement.url)}
        {!measurement.is_uploaded && <NotUploadedNotice />}
      </Box>
      <Box width={1/8} h={1}>
        <Status notok={isAnomaly} />
      </Box>
      <Box ml='auto' mr={3}>
        <RightArrowStyled />
      </Box>
    </BorderedFlex>
  </Link>
)

const IconContainer = styled.div`
  display: inline;
  padding-right: 10px;
`

const StatusBox = ({testName, testKeys, isAnomaly}) => {
  if (testName === 'http_invalid_request_line' || testName === 'http_header_field_manipulation') {
    return <Status notok={isAnomaly} warning />
  }

  if (testName === 'dash') {
    return <VideoQuality bitrate={testKeys['median_bitrate']} />
  }

  if (testName === 'ndt') {
    return <div>
      <DownloadSpeed bits={testKeys['download']} />
      <UploadSpeed bits={testKeys['upload']} />
    </div>
  }

  return (
    <Status notok={isAnomaly} />
  )
}

const TestNameIcon = ({ testName }) => {
  let name = testName
  let icon = null

  if (testName in tests) {
    name = tests[testName].name
    icon = tests[testName].icon && React.cloneElement(
      tests[testName].icon,
      {size: 40}
    )
  }

  return (
    <Flex alignItems='center'>
      {icon && <IconContainer>{icon}</IconContainer>}
      <Text data-testid='measured-test-name'>{name}</Text>
    </Flex>
  )
}
// XXX still need to show the summary in here
const TestRow =  ({measurement, resultID, measurementID, testKeys, isAnomaly}) => {

  return (
    <Link href={{pathname: `/result/${resultID}/measurement/${measurementID}`, query : {isAnomaly}}}>
      <BorderedFlex alignItems='center'>
        <Box width={5/8} pl={2}>
          <Flex alignItems='center'>
            <TestNameIcon testName={measurement.test_name} />
            {!measurement.is_uploaded && <NotUploadedNotice />}
          </Flex>
        </Box>
        <Box width={2/8} h={1}>
          <StatusBox testName={measurement.test_name} isAnomaly={isAnomaly} testKeys={testKeys} />
        </Box>
        <Box width={1/8} style={{marginLeft: 'auto'}}>
          <VerticalCenter>
            <RightArrowStyled />
          </VerticalCenter>
        </Box>
      </BorderedFlex>
    </Link>
  )
}

const IncompleteRow = ({ testName }) => {
  return (
    <BorderedFlex noHover color='gray5' bg='gray0' alignItems='center'>
      <Box width={5/8} pl={2}>
        <TestNameIcon testName={testName} />
      </Box>
      <Box>
        <FormattedMessage id='TestResults.Summary.ErrorInMeasurement' />
      </Box>
    </BorderedFlex>
  )
}

const rowMap = {
  'websites': URLRow,
  'im': TestRow,
  'middlebox': TestRow,
  'performance': TestRow,
  'circumvention': TestRow,
  'experimental': TestRow,
}

const MeasurementRow = ({ groupName, measurement }) => {
  const { query } = useRouter()

  if (measurement == null || groupName === 'default') {
    return <Text color={theme.colors.red8}>Error</Text>
  }

  const testKeys = parseTestKeys(measurement['test_keys'])

  if (!testKeys) {
    return <IncompleteRow testName={measurement.test_name} />
  }

  // We pass in `is_anomaly` here to use in the `/measurement` page
  const isAnomaly = measurement.is_anomaly ?? false

  const RowElement = rowMap[groupName]

  // NOTE: For now, hiding results of tests that aren't supported yet
  if (Object.keys(tests).indexOf(measurement.test_name) < 0) {
    return <div />
  }
  return (
    <RowElement
      measurement={measurement}
      resultID={query.resultID}
      measurementID={measurement.id}
      testKeys={testKeys}
      isAnomaly={isAnomaly}
    />
  )
}

export default MeasurementRow
