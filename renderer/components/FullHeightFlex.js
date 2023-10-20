import { Flex } from 'ooni-components'
import styled from 'styled-components'

// This will work only inside a
// <Flex flexDirection='column'> with explicit (min-)height
// Ref: https://css-tricks.com/boxes-fill-height-dont-squish/
const FullHeightFlex = styled(Flex)`
  flex-grow: 1
`

export default FullHeightFlex
