import React from 'react'
import styled, { keyframes } from 'styled-components'
import PropTypes from 'prop-types'

const OuterBar = styled.div`
	height: 20px;
	position: relative;
	background: rgba(255,255,255,0.4);
	-moz-border-radius: 25px;
	-webkit-border-radius: 25px;
	border-radius: 25px;
`

const moveAnim = keyframes`
  0% {
    background-position: 0 0;
  }
  100% {
    background-position: 50px 50px;
  }
`

const StripedBar = styled.span`
  display: block;
  height: 100%;
	border-radius: 25px;
  width: ${props => props.percent || 100}%;
  background-color: ${props => props.theme.colors.gray5};
  position: relative;
  overflow: hidden;


  &:after {
    content: "";
    position: absolute;
    top: 0; bottom: 0; left: 0; right: 0;
    background-image: linear-gradient(
      -45deg,
      rgba(255, 255, 255, .2) 25%,
      transparent 25%,
      transparent 50%,
      rgba(255, 255, 255, .2) 50%,
      rgba(255, 255, 255, .2) 75%,
      transparent 75%,
      transparent
    );
    z-index: 1;
    background-size: 15px 15px;
    animation: ${moveAnim} 3s linear infinite;
    overflow: hidden;
  }
`

export const StripedProgress = ({ percent }) => {
  return (
    <OuterBar>
      <StripedBar percent={percent} />
    </OuterBar>
  )
}

StripedProgress.propTypes = {
  percent: PropTypes.number
}
