import React from 'react'
import {
  Flex,
  Box,
  theme,
  Text
} from 'ooni-components'

import { FacebookMessengerDetails } from './im/facebook-messenger'

// XXX this should be moved to the design-system
import { IoMdSpeedometer } from 'react-icons/io'

import im from './im'
import middlebox from './middleboxes'
import performance from './performance'
import websites from './websites'

import web_connectivity from './websites/WebConnectivity'
import http_header_field_manipulation from './middleboxes/HttpHeaderFieldManipulation'
import http_invalid_request_line from './middleboxes/HttpInvalidRequestLine'

import {
  Cross,
  Tick
} from 'ooni-components/dist/icons'

const TODODetails = ({testKeys, isAnomaly, url, urlCategoryCode}) => {
  return <Flex flexWrap='wrap' alignItems='flex-start' p={3}>
    {url
    && <Box width={1}>
      <Text center fontSize={3}>{url} ({urlCategoryCode})</Text>
    </Box>}
    {isAnomaly
    && <Box width={1}>
      <Text center fontSize={3} color={theme.colors.red5}><Cross />An anomaly is present</Text>
    </Box>}
    {isAnomaly === false
    && <Box width={1}>
      <Text color={theme.colors.green6} center fontSize={3}><Tick />Everything is OK</Text>
    </Box>}
    {Object.keys(testKeys).map(key =>
      <Box key={key} width={1/2}>
        <Text bold>{key}</Text><Text>{JSON.stringify(testKeys[key])}</Text>
      </Box>
    )}
    <Box width={1}><Text bold>Attention this is a beta, as such, things are subject to change</Text></Box>
  </Flex>
}

const detailsMap = {
  facebook_messenger: FacebookMessengerDetails
}

export const renderDetails = (measurement) => {
  let testKeys = {}
  const Component = detailsMap[name]
  if (measurement.test_keys) {
    testKeys = JSON.parse(measurement.test_keys)
  }
  if (!Component) {
    return (
      <TODODetails
        url={measurement.url}
        urlCategoryCode={measurement.url_category_code}
        isAnomaly={measurement.is_anomaly}
        testKeys={testKeys} />
    )
  }
  return (
    <Component
      url={measurement.url}
      urlCategoryCode={measurement.url_category_code}
      testKeys={testKeys}
      isAnomaly={measurement.is_anomaly} />
  )
}

const iconSize = 200
const iconColor = theme.colors.black

export const testGroups = {
  websites,
  im,
  middlebox,
  performance,
  'default': {
    'color': theme.colors.blue5,
    'description': '',
    'longDescription': '',
    'name': 'Default',
    'icon': <IoMdSpeedometer />,
  }
}

// Metadata for tests
// Contains: {
//  name: Full descriptive name of the test, translated with <FormattedMessage>
//}
export const tests = {
  // TODO: (sarathms) Replace each one with their own implementations when ready
  web_connectivity,
  http_header_field_manipulation,
  http_invalid_request_line: http_invalid_request_line,
  telegram: web_connectivity,
  whatsapp: web_connectivity,
  ndt: web_connectivity,
  dash: web_connectivity,
  vanilla_tor: web_connectivity,
  'default': {
    'name': 'Default',
  }
}

export const testList  = ['websites', 'im', 'performance', 'middlebox'].map(key => ({
  name: testGroups[key].name,
  key: key,
  color: testGroups[key].color,
  description: testGroups[key].description,
  longDescription: testGroups[key].longDescription,
  icon: React.cloneElement(
    testGroups[key].icon,
    {size: iconSize, color: iconColor}
  )
}))
