import React from 'react'
import styled from 'styled-components'
import { Flex, Box, Fixed, Heading} from 'ooni-components'
import ReactJson from 'react-json-view'
import { useSpring, animated } from 'react-spring'
import { MdClose } from 'react-icons/md'
import { FormattedMessage } from 'react-intl'

// Elevating with zIndex because <Button> has zIndex:1 for some reason
const StyledWrapper = styled(Fixed)`
  height: 70vh;
  overflow-x: hidden;
  overflow-y: scroll;
  background-color: ${props => props.theme.colors.gray1};
  z-index: 2;

  &::-webkit-scrollbar {
    display: none;
  }
`

const AnimatedWrapper = animated(StyledWrapper)

const StyledReactJsonContainer = styled.div`
  .string-value {
    text-overflow: ellipsis;
    max-width: 800px;
    overflow: hidden;
    display: inline-block;
  }
`

const StyledCloseButton = styled(MdClose)`
  cursor: pointer;
`

const RawDataContainer = ({ rawData, isOpen, onClose }) => {

  const props = useSpring({
    from: { bottom: -6000 },
    to: { bottom: isOpen ? 0 : -2000 }
  })

  return (
    <AnimatedWrapper bottom={props.bottom} left right>
      <Flex flexDirection='column' flexWrap='wrap'>
        <Box width={1} mb={2}>
          <Flex justifyContent='space-between' alignItems='center' bg='gray3'>
            <Box mx={3}>
              <Heading h={3}>
                <FormattedMessage id='TestResults.Details.RawData' />
              </Heading>
            </Box>
            <Box mx={3}>
              <StyledCloseButton size={20} onClick={() => onClose()} />
            </Box>
          </Flex>
        </Box>
        <Box width={1}>
          <StyledReactJsonContainer>
            <ReactJson src={rawData} collapsed={1} />
          </StyledReactJsonContainer>
        </Box>
      </Flex>
    </AnimatedWrapper>
  )
}

export default RawDataContainer
