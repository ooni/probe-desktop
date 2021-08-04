import React, { useEffect, useCallback } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Flex, Box, Heading} from 'ooni-components'
import { useSpring, animated } from 'react-spring'
import { MdClose } from 'react-icons/md'
import { FormattedMessage } from 'react-intl'

// Elevating with zIndex because <Button> has zIndex:1 for some reason
const StyledWrapper = styled(Box)`
  position: fixed;
  height: 100vh;
  overflow-x: hidden;
  overflow-y: scroll;
  background-color: ${props => props.theme.colors.gray1};
  z-index: 2;
  right: 0;
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

const StickyBox = styled(Box)`
  position: sticky;
  top: 0px;
  z-index: 1;
`

const RawDataContainer = ({ rawData, isOpen, onClose }) => {

  const props = useSpring({
    from: { top: 2000 },
    to: { top: isOpen ? 0 : 2000 }
  })

  // We wrap the json viewer so that we can render it only in client side rendering
  class JsonViewer extends React.Component {
    render() {
      // eslint-disable-next-line no-undef
      const ReactJson = require('react-json-view').default
      const {
        src
      } = this.props
      // direction: ${props => props.theme.isRTL ? 'rtl' : 'ltr'};
      const StyledReactJsonContainer = styled.div`
        /*! @noflip */
        direction: ltr;
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

  const onEscape = useCallback((event) => {
    if (event.key === 'Escape') {
      onClose()
    }
  })

  const onClick = useCallback((event) => {
    if (event.target.dataset.id === 'sidebar') {
      onClose()
    }
  })

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', onEscape)
      document.addEventListener('click', onClick)
    } else {
      document.removeEventListener('keydown', onEscape)
      document.removeEventListener('click', onClick)
    }

    return () => {
      document.removeEventListener('keydown', onEscape)
      document.removeEventListener('click', onClick)
    }
  }, [isOpen])

  return (
    <AnimatedWrapper style={props} width={4/5}>
      <Flex flexDirection='column' flexWrap='wrap' data-testid='container-json-viewer'>
        <StickyBox width={1} mb={2}>
          <Flex justifyContent='space-between' alignItems='center' bg='gray3'>
            <Box mx={3}>
              <Heading h={3} data-testid='heading-json-viewer'>
                <FormattedMessage id='TestResults.Details.RawData' />
              </Heading>
            </Box>
            <Box mx={3}>
              <StyledCloseButton size={20} onClick={() => onClose()} />
            </Box>
          </Flex>
        </StickyBox>
        <Box width={1} data-testid='data-json-viewer'>
          <StyledReactJsonContainer>
            <JsonViewer src={rawData} />
          </StyledReactJsonContainer>
        </Box>
      </Flex>
    </AnimatedWrapper>
  )
}

export default RawDataContainer
