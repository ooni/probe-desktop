import React from 'react'
import PropTypes from 'prop-types'
import { Flex, Box, Text } from 'ooni-components'

import colorMap from '../colorMap'

const StatusBox = ({label, value, ok = 'true', color}) => (
  <Flex flexWrap='wrap'>
    <Box width={1}>
      <Text fontSize={1}>{label}</Text>
    </Box>
    <Box width={1}>
      <Text fontSize={3} fontWeight={300} color={color || (ok ? 'unset' : colorMap.anomaly)}>{value}</Text>
    </Box>
  </Flex>
)

StatusBox.propTypes = {
  label: PropTypes.node.isRequired,
  value: PropTypes.node.isRequired,
  ok: PropTypes.bool,
  color: PropTypes.string
}

export default StatusBox
