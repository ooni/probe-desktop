import React from 'react'
import {
  theme,
} from 'ooni-components'

// XXX this should be moved to the design-system
import { IoMdSpeedometer } from 'react-icons/io'

import im from './im'
import middlebox from './middleboxes'
import performance from './performance'
import websites from './websites'
import circumvention from './circumvention'

import web_connectivity from './websites/WebConnectivity'
import http_header_field_manipulation from './middleboxes/HttpHeaderFieldManipulation'
import http_invalid_request_line from './middleboxes/HttpInvalidRequestLine'
import facebook_messenger from './im/FacebookMessenger'
import telegram from './im/Telegram'
import whatsapp from './im/WhatsApp'
import ndt from './performance/NDT'
import dash from './performance/Dash'
import psiphon from './circumvention/Psiphon'
import tor from './circumvention/Tor'
import riseupvpn from './circumvention/RiseupVPN'
import signal from './im/Signal'
import { default as animation } from '../../public/static/animations/loadingTests.json'

const iconSize = 200
const iconColor = theme.colors.black

export const testGroups = {
  websites,
  im,
  middlebox,
  performance,
  circumvention,
  'default': {
    'color': theme.colors.gray7,
    'description': '',
    'longDescription': '',
    'name': '',
    'icon': <IoMdSpeedometer />,
    animation
  }
}

// Metadata for tests
// Contains: {
//  name: Full descriptive name of the test, translated with <FormattedMessage>
//}
export const tests = {
  web_connectivity,
  http_header_field_manipulation,
  http_invalid_request_line,
  facebook_messenger,
  telegram,
  whatsapp,
  ndt,
  dash,
  psiphon,
  tor,
  riseupvpn,
  signal,
  'default': {
    'name': 'Default',
  }
}

// Note: The order of test groups controls how they are rendered in the home screen
export const testList  = ['websites', 'im', 'circumvention', 'performance', 'middlebox'].map(key => ({
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

export const cliTestKeysToGroups = {
  'nettests.WebConnectivity': 'websites',
  'nettests.HTTPInvalidRequestLine': 'middlebox',
  'nettests.HTTPHeaderFieldManipulation': 'middlebox',
  'nettests.FacebookMessenger': 'im',
  'nettests.Telegram': 'im',
  'nettests.WhatsApp': 'im',
  'nettests.Dash': 'performance',
  'nettests.NDT': 'performance',
  'nettests.Psiphon': 'circumvention',
  'nettests.Tor': 'circumvention',
  'nettests.RiseupVPN': 'circumvention',
  'nettests.Signal': 'im'
}
