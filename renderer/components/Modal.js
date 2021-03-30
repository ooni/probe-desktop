import { Box } from 'ooni-components'
import styled from 'styled-components'

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
