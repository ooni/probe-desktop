import React from 'react'

import {
  theme
} from 'ooni-components'

import styled from 'styled-components'

import BarLoader from './BarLoader'

const StyledLoading = styled.div`
  position: fixed;
  top: 0;
  background-color: rgba(0, 0, 0, 0.5);
  width: 100%;
  height: 100%;
  z-index: 9999;
  display: ${props => props.loading ? 'block' : 'none'};
`

const Aligner = styled.div`
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  height: 100%;
`

const BarContainer = styled.div`
  display: flex;
  width: 200px;
  z-index: 99999;
  opacity: 1;
`

const LoadingOverlay = ({loading}) => {
  return (
    <StyledLoading loading={loading}>
      <Aligner>
        <BarContainer>
          <BarLoader color={theme.colors.blue5} size={20} />
        </BarContainer>
      </Aligner>
    </StyledLoading>
  )
}

export default LoadingOverlay
