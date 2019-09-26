import React from 'react'
import { FormattedMessage } from 'react-intl'
import { Flex, Box, Text } from 'ooni-components'

const WebConnectivity = ({measurement, render}) => {
  const Hero = () => (
    <Flex py={6} flexWrap='wrap' bg='green8'>
      <Box width={1} mb={4}>
        <Text textAlign='center'>Hero</Text>
      </Box>
      <Box width={1/2}>
        <Text textAlign='center'>{measurement.network_country_code}</Text>
      </Box>
      <Box width={1/2}>
        <Text textAlign='center'>{measurement.network_name}</Text>
      </Box>
    </Flex>
  )

  const CollapsedHero = () => (
    <Flex bg='yellow9' py={3}>
      <Box> Different content for a collapsed Hero </Box>
    </Flex>
  )

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
        hero: <Hero />,
        collapsedHero: <CollapsedHero />,
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
