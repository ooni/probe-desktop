import React from 'react'
import {
  theme,
} from 'ooni-components'

import { FacebookMessengerDetails } from './im/facebook-messenger'

// XXX this should be moved to the design-system
import IoSpeedometer from 'react-icons/lib/io/speedometer'

import im from './im'
import middlebox from './middleboxes'
import performance from './performance'
import websites from './websites'

const TODODetails = ({testKeys, isAnomaly}) => {
  return <div>
    {JSON.stringify(isAnomaly)} - {JSON.stringify(testKeys, null, 2)}
  </div>
}

const detailsMap = {
  facebook_messenger: FacebookMessengerDetails
}

export const renderDetails = (name, isAnomaly, testKeys) => {
  const Component = detailsMap[name]
  if (testKeys) {
    testKeys = JSON.parse(testKeys)
  }
  if (!Component) {
    return <TODODetails isAnomaly={isAnomaly} testKeys={testKeys} />
  }
  return <Component testKeys={testKeys} isAnomaly={isAnomaly} />
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
