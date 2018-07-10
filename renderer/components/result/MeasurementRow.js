/* global require */
import React from 'react'

import Raven from 'raven-js'

import { withRouter } from 'next/router'

import styled from 'styled-components'

import {
  Text,
  Container,
  Box,
  Divider
} from 'ooni-components'

const debug = require('debug')('ooniprobe-desktop.renderer.pages.results')

const MeasurementRow = (m) => {
  debug('rendering', m)
  return (
    <Box w={1}>
      <Text>{m.measurement_name}</Text>
      <Text>{m.input}</Text>
      <Divider />
    </Box>
  )
}

export default MeasurementRow
