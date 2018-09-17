import React from 'react'
import {
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

const TODODetails = ({testKeys, isAnomaly, url, urlCategoryCode}) => {
  return <div>
    <Text>{url} ({urlCategoryCode})</Text>
    <Text>isAnomaly: {JSON.stringify(isAnomaly)}</Text>
    <Text>testKeys: {JSON.stringify(testKeys, null, 2)}</Text>
  </div>
}

const detailsMap = {
  facebook_messenger: FacebookMessengerDetails
}

export const renderDetails = (measurement) => {
  let testKeys
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
