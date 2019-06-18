import React from 'react'

import 'react-sticky-header/styles.css'
import StickyHeader from 'react-sticky-header'
import PropTypes from 'prop-types'

import styled from 'styled-components'

import { Box } from 'ooni-components'

const HeaderContent = styled(Box)`
  height: 20px;
  background-color: red;
  color: ${props => props.theme.colors.white};
  /* This makes it possible to drag the window around from the side bar */
  -webkit-app-region: drag;
`

const StickyDraggableHeader = props => (
  <StickyHeader header={
    <HeaderContent />
  }>
    {props.children}
  </StickyHeader>
)

StickyDraggableHeader.propTypes = {
  color: PropTypes.string,
  duration: PropTypes.number,
  size: PropTypes.number,
}

StickyDraggableHeader.defaultProps = {
  color: '#000',
  duration: 1,
  size: 11,
}

export default StickyDraggableHeader
