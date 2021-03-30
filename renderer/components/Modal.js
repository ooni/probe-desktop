import { Box } from 'ooni-components'
import styled from 'styled-components'

export const Modal = styled(Box)`
  position: fixed;
  z-index: 1001;
  max-width: 100vw;
  max-height: 100vh;
  overflow: auto;
  transform: translate(-50%, -50%);
  box-shadow: rgba(0, 0, 0, 0.80) 0 0 0 60vmax, rgba(0, 0, 0, 0.25) 0 0 32px;
  border-radius: 10px;
  top: 50%;
  left: 50%;
  background-color: ${props => props.bg || props.theme.colors.blue5};
  visibility: ${props => props.show ? 'visible': 'hidden'};
`

export const ModalButton = styled(Box)`
  height: 50px;
  text-align: center;
  line-height: 50px;
  cursor: pointer;
`

export const YesButton = styled(ModalButton)`
  background-color: ${props => props.theme.colors.green7};
  &:hover {
    background-color: ${props => props.theme.colors.green6};
  }
`

export const NoButton = styled(ModalButton)`
  background-color: ${props => props.theme.colors.red8};
  &:hover {
    background-color: ${props => props.theme.colors.red7};
  }
`
