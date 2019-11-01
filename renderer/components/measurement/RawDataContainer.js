import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Flex, Box, Fixed, Heading} from 'ooni-components'
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

  // We wrap the json viewer so that we can render it only in client side rendering
  class JsonViewer extends React.Component {
    render() {
      const ReactJson = require('react-json-view').default
      const {
        src
      } = this.props
      const StyledReactJsonContainer = styled.div`
        .string-value {
          text-overflow: ellipsis;
          max-width: 800px;
          overflow: hidden;
          display: inline-block;
        }
      `
      return (
        <StyledReactJsonContainer>
          <ReactJson collapsed={1} src={src} />
        </StyledReactJsonContainer>
      )
    }
  }

  JsonViewer.propTypes = {
    src: PropTypes.object.isRequired
  }

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
            <JsonViewer src={rawData} />
          </StyledReactJsonContainer>
        </Box>
      </Flex>
    </AnimatedWrapper>
  )
}

export default RawDataContainer
