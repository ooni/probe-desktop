import React from 'react'

import 'react-sticky-header/styles.css'
import { StickyContainer, Sticky } from 'react-sticky'
import PropTypes from 'prop-types'

import styled from 'styled-components'

import { Box } from 'ooni-components'

const HeaderContent = styled(Box)`
  height: ${props => props.height};
  background-color: ${props => props.bg};
  color: ${props => props.theme.colors.white};
  /* This makes it possible to drag the window around from the side bar */
  -webkit-app-region: drag;
`

const StickyDraggableHeader = (props) => (
  <StickyContainer>
    <Sticky topOffset={props.topOffset}>
      {({
        style,
        isSticky
      }) => {
        let bg = props.color
        if (isSticky) {
          bg = props.stickyColor
        }
        return (
          <HeaderContent
            bg={bg}
            height={props.height}
            style={style}>{props.header}</HeaderContent>
        )
      }}
    </Sticky>
    {props.children}
  </StickyContainer>
)

StickyDraggableHeader.defaultProps = {
  color: 'transparent',
  stickyColor: 'transparent',
  height: '40px',
  topOffset: 0
}

StickyDraggableHeader.propTypes = {
  topOffset: PropTypes.number,
  color: PropTypes.string,
  stickyColor: PropTypes.string,
  height: PropTypes.string,
}

export default StickyDraggableHeader
