import React from 'react'
import PropTypes from 'prop-types'

import {
  Flex,
  Box
} from 'ooni-components'

const TwoColumnTable = ({left, right}) => {
  return (
    <Flex alignItems='center' mb={2}>
      <Box>
        {left}
      </Box>
      <Box ml='auto'>
        {right}
      </Box>
    </Flex>
  )
}

TwoColumnTable.propTypes = {
  left: PropTypes.node,
  right: PropTypes.node
}

export default TwoColumnTable
