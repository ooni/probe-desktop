import React from 'react'
import { FormattedMessage } from 'react-intl'
import { Flex, Box, Text } from 'ooni-components'

const WebConnectivity = ({measurement, render}) => {

  const WebDetails = () => (
    <Flex justifyContent='center'>
      <Box>
        <Flex my={6}>
          <Box> Web Details </Box>
          <Box>  </Box>
        </Flex>
        <Flex my={6}>
          <Box> More Details </Box>
          <Box>  </Box>
        </Flex>
        <Flex my={6}>
          <Box> More Details </Box>
          <Box>  </Box>
        </Flex>
        <Flex my={6}>
          <Box> More Details </Box>
          <Box>  </Box>
        </Flex>
      </Box>
    </Flex>
  )

  return (
    <div>
      {render({
        heroBG: 'green8', // TODO: (sarathms) Determine color based on presence of anomaly
        details: <WebDetails />
      })}
    </div>
  )
}

export { WebConnectivity }

// Metadata for the nettest
export default {
  name: <FormattedMessage id='Test.WebConnectivity.Fullname' />
}
