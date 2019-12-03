import React from 'react'

import Link from 'next/link'
import { withRouter } from 'next/router'

import { FormattedMessage } from 'react-intl'

import {
  theme,
  Text,
  Flex,
  Box
} from 'ooni-components'

import {
  NettestWhatsApp,
  NettestTelegram,
  NettestFacebookMessenger,
  Cross,
  Tick
} from 'ooni-components/dist/icons'

import styled from 'styled-components'
import RightArrow from '../RightArrow'

import UploadSpeed from '../UploadSpeed'
import DownloadSpeed from '../DownloadSpeed'
import VideoQuality from '../VideoQuality'

// XXX this should be moved to the design-system
import { MdPriorityHigh } from 'react-icons/md'

import * as OOIcons from 'ooni-components/dist/icons'

const BorderedRow = styled(Flex)`
  width: 100%;
  padding-top: 20px;
  padding-bottom: 20px;
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

const formatURL = (url) => {
  if (url.length > 32) {
    return url.substr(0, 31) + '…'
  }
  return url
}

const Status = ({notok, warning}) => {
  if (notok === false) {
    return <Tick size={30} color={theme.colors.green7} />
  }
  if (notok === true) {
    if (warning === true) {
      return <MdPriorityHigh size={30} color={theme.colors.yellow8} />
    }
    return <Cross size={30} color={theme.colors.red8} />
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

const URLRow =  ({measurement, query, isAnomaly}) => (
  <Link href={{pathname: '/measurement', query}}>
    <BorderedRow>
      <Box pr={2} pl={2} width={1/8}>
        <CategoryCode code={measurement['url_category_code']} />
      </Box>
      <Box width={6/8} h={1}>
        {formatURL(measurement.url)}
      </Box>
      <Box width={1/8} h={1}>
        <Status notok={isAnomaly} />
      </Box>
      <Box width={1/8} style={{marginLeft: 'auto'}}>
        <VerticalCenter>
          <RightArrowStyled />
        </VerticalCenter>
      </Box>
    </BorderedRow>
  </Link>
)

const fullnameMap = {
  web_connectivity: 'Test.WebConnectivity.Fullname',
  dash: 'Test.Dash.Fullname',
  ndt: 'Test.NDT.Fullname',
  facebook_messenger: 'Test.FacebookMessenger.Fullname',
  telegram: 'Test.Telegram.Fullname',
  whatsapp: 'Test.WhatsApp.Fullname',
  http_invalid_request_line: 'Test.HTTPInvalidRequestLine.Fullname',
  http_header_field_manipulation: 'Test.HTTPHeaderFieldManipulation.Fullname',
  psiphon: 'Test.Psiphon.Fullname'
}

const IconContainer = styled.div`
  display: inline;
  padding-right: 10px;
`

const iconMap = {
  facebook_messenger: <NettestFacebookMessenger size={40} />,
  telegram: <NettestTelegram size={40} />,
  whatsapp: <NettestWhatsApp size={40} />,
  psiphon: <NettestWhatsApp size={40} />
}

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

// XXX still need to show the summary in here
const TestRow =  ({measurement, query, testKeys, isAnomaly}) => {

  const icon = iconMap[measurement.test_name]
  let fullnameID = fullnameMap[measurement.test_name]
  if (!fullnameID) {
    fullnameID = 'Test.MISSING.Fullname'
  }

  return (
    <Link href={{pathname: '/measurement', query}}>
      <BorderedRow>
        <Box width={5/8} pl={2}>
          {icon && <IconContainer>{icon}</IconContainer>}
          <FormattedMessage id={fullnameID} />
        </Box>
        <Box width={2/8} h={1}>
          <StatusBox testName={measurement.test_name} isAnomaly={isAnomaly} testKeys={testKeys} />
        </Box>
        <Box width={1/8} style={{marginLeft: 'auto'}}>
          <VerticalCenter>
            <RightArrowStyled />
          </VerticalCenter>
        </Box>
      </BorderedRow>
    </Link>
  )
}

const rowMap = {
  'websites': URLRow,
  'im': TestRow,
  'middlebox': TestRow,
  'performance': TestRow,
  'circumvention': TestRow
}

const MeasurementRow = ({groupName, measurement, router}) => {
  if (measurement == null || groupName === 'default' || !measurement['test_keys']) {
    return <Text color={theme.colors.red8}>Error</Text>
  }

  const testKeys = JSON.parse(measurement['test_keys'])
  // We pass in `is_anomaly` here to use in the `/measurement` page
  const query = {...router.query, measurementID: measurement.id, isAnomaly: measurement.is_anomaly}

  const RowElement = rowMap[groupName]
  return <RowElement measurement={measurement} query={query} testKeys={testKeys} isAnomaly={measurement['is_anomaly']} />
}

export default withRouter(MeasurementRow)
