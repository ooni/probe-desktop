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

const TODODetails = ({summary}) => {
  return <div>
    {JSON.stringify(summary, null, 2)}
  </div>
}

const detailsMap = {
  FacebookMessenger: FacebookMessengerDetails
}

export const renderDetails = (name, summary) => {
  const Component = detailsMap[name]
  if (summary) {
    summary = JSON.parse(summary)
  }
  if (!Component) {
    return <TODODetails summary={summary} />
  }
  return <Component summary={summary} />
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
