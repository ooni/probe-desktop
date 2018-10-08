import React from 'react'
import {
  Flex,
  Box,
  theme,
  Text
} from 'ooni-components'

import { FacebookMessengerDetails } from './im/facebook-messenger'

// XXX this should be moved to the design-system
import IoSpeedometer from 'react-icons/lib/io/speedometer'

import im from './im'
import middlebox from './middleboxes'
import performance from './performance'
import websites from './websites'

import {
  Cross,
  Tick
} from 'ooni-components/dist/icons'

const TODODetails = ({testKeys, isAnomaly, url, urlCategoryCode}) => {
  return <Flex wrap align='flex-start' p={3}>
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
    'icon': <IoSpeedometer />,
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