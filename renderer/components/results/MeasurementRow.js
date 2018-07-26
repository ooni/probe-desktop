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

import UploadSpeed from './UploadSpeed'
import DownloadSpeed from './DownloadSpeed'
import VideoQuality from './VideoQuality'

// XXX this should be moved to the design-system
import MdPriorityHigh from 'react-icons/lib/md/priority-high'
import MdTexture from 'react-icons/lib/md/texture'

const BorderedRow = styled(Flex)`
  width: 100%;
  padding-top: 20px;
  padding-bottom: 20px;
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

const URLRow =  ({measurement, query, summary}) => (
  <BorderedRow>
    <Box pr={2} pl={2} w={1/8}>
      <MdTexture  size={30}/>
    </Box>
    <Box w={6/8} h={1}>
      {formatURL(measurement.input)}
    </Box>
    <Box w={1/8} h={1}>
      <Status notok={summary.Blocked} />
    </Box>
    <Box w={1/8} style={{marginLeft: 'auto'}}>
      <Link href={{pathname: '/results', query}}>
        <a>
          <VerticalCenter>
            <RightArrow />
          </VerticalCenter>
        </a>
      </Link>
    </Box>
  </BorderedRow>
)

const fullnameMap = {
  WebConnectivity: 'Test.WebConnectivity.Fullname',
  Dash: 'Test.Dash.Fullname',
  Ndt: 'Test.NDT.Fullname',
  FacebookMessenger: 'Test.FacebookMessenger.Fullname',
  Telegram: 'Test.Telegram.Fullname',
  Whatsapp: 'Test.WhatsApp.Fullname',
  HttpInvalidRequestLine: 'Test.HTTPInvalidRequestLine.Fullname',
  HttpHeaderFieldManipulation: 'Test.HTTPHeaderFieldManipulation.Fullname'
}

const IconContainer = styled.div`
  display: inline;
  padding-right: 10px;
`

const iconMap = {
  FacebookMessenger: <NettestFacebookMessenger size={40} />,
  Telegram: <NettestTelegram size={40} />,
  Whatsapp: <NettestWhatsApp size={40} />
}

const renderStatus = (measurementName, summary) => {
  if (measurementName === 'HttpInvalidRequestLine' || measurementName === 'HttpHeaderFieldManipulation') {
    return <Status notok={summary.Tampering} warning />
  }

  if (measurementName === 'Dash') {
    return <VideoQuality bitrate={summary['Bitrate']} />
  }

  if (measurementName === 'Ndt') {
    return <div>
      <DownloadSpeed bits={summary['Download']} />
      <UploadSpeed bits={summary['Upload']} />
    </div>
  }

  return (
    <Status notok={summary.Blocked} />
  )
}

// XXX still need to show the summary in here
const TestRow =  ({measurement, query, summary}) => {

  const icon = iconMap[measurement.measurement_name]
  let fullnameID = fullnameMap[measurement.measurement_name]
  if (!fullnameID) {
    fullnameID = 'Test.MISSING.Fullname'
  }

  return (
    <BorderedRow>
      <Box w={5/8} pl={2}>
        {icon && <IconContainer>{icon}</IconContainer>}
        <FormattedMessage id={fullnameID} />
      </Box>
      <Box w={2/8} h={1}>
        {renderStatus(measurement.measurement_name, summary)}
      </Box>
      <Box w={1/8} style={{marginLeft: 'auto'}}>
        <Link href={{pathname: '/results', query}}>
          <a>
            <VerticalCenter>
              <RightArrow />
            </VerticalCenter>
          </a>
        </Link>
      </Box>
    </BorderedRow>
  )
}

const rowMap = {
  'websites': URLRow,
  'im': TestRow,
  'middlebox': TestRow,
  'performance': TestRow
}

const MeasurementRow = ({groupName, measurement, router}) => {
  if (measurement == null || groupName === 'default') {
    return <Text color={theme.colors.red8}>Error</Text>
  }

  const summary = JSON.parse(measurement.summary)
  const query = {...router.query, measurementID: measurement.id}

  const RowElement = rowMap[groupName]
  return <RowElement measurement={measurement} query={query} summary={summary} />
}

export default withRouter(MeasurementRow)
