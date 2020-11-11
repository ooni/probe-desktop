import React from 'react'
import styled from 'styled-components'
import { Box } from 'ooni-components'
import DashboardHeaderSVG from '../../../static/DashboardHeader.svg'

export const DashboardHeader = styled(Box)`
  position: static;
  /* This makes it possible to drag the window around from the side bar */
  -webkit-app-region: drag;
`

export const DashboardHeaderBG = styled(DashboardHeaderSVG)`
  fill: ${props => props.theme.colors.blue5};
  position: absolute;
`

export default DashboardHeaderBG
