/* global require */
import React from 'react'

import Raven from 'raven-js'

import { withRouter } from 'next/router'

import styled from 'styled-components'

import {
  Text,
  Container,
  Flex,
  Box,
  Divider,
  Button
} from 'ooni-components'

const debug = require('debug')('ooniprobe-desktop.renderer.pages.results')

const MeasurementRow = ({measurement, onSelect}) => {
  debug('rendering', measurement)
  return (
    <Box w={1}>
      <Text>{measurement.measurement_name}</Text>
      <Text>{measurement.input}</Text>
      <Button onClick={() => onSelect(measurement)}>Open</Button>
      <Divider />
    </Box>
  )
}

export default MeasurementRow
