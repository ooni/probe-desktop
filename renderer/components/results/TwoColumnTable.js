import React from 'react'

import {
  Flex,
  Box
} from 'ooni-components'

const TwoColumnTable = ({left, right}) => {
  return (
    <Flex align='center' pb={1}>
      <Box>
        {left}
      </Box>
      <Box ml='auto'>
        {right}
      </Box>
    </Flex>
  )
}

export default TwoColumnTable
