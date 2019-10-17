import React from 'react'
import PropTypes from 'prop-types'
import { Flex, Box, Text } from 'ooni-components'

import { colorMap } from './MeasurementContainer'

const StatusBox = ({label, value, ok = 'true'}) => (
  <Flex flexWrap='wrap'>
    <Box width={1}>
      <Text fontSize={1}>{label}</Text>
    </Box>
    <Box width={1}>
      <Text fontSize={3} fontWeight={300} color={ok ? 'unset' : colorMap.anomaly}>{value}</Text>
    </Box>
  </Flex>
)

StatusBox.propTypes = {
  label: PropTypes.node.isRequired,
  value: PropTypes.node.isRequired,
  ok: PropTypes.bool
}

export default StatusBox
