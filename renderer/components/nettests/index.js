import React from 'react'
import {
  Flex,
  Box,
  theme,
  Text
} from 'ooni-components'

// XXX this should be moved to the design-system
import { IoMdSpeedometer } from 'react-icons/io'

import im from './im'
import middlebox from './middleboxes'
import performance from './performance'
import websites from './websites'

import web_connectivity from './websites/WebConnectivity'
import http_header_field_manipulation from './middleboxes/HttpHeaderFieldManipulation'
import http_invalid_request_line from './middleboxes/HttpInvalidRequestLine'
import facebook_messenger from './im/FacebookMessenger'
import telegram from './im/Telegram'

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
  http_invalid_request_line,
  facebook_messenger,
  telegram,
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
