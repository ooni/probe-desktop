import React from 'react'

import styled from 'styled-components'

const LeftColumn = styled.div`
  display: flex;
  flex: 1;
  width: 50%;
  background-color: ${props => props.color || props.theme.colors.blue5};
`

const RightColumn = styled.div`
  display: flex;
  overflow: auto;
  flex: 1;
  width: 50%;
`

const MainContainer = styled.div`
  flex: 1;
  display: flex;
  position: relative;
  width: 100%;
`

const TwoColumnHero = ({left, right, bg}) => {
  return (
    <MainContainer>
      <LeftColumn color={bg}>
        {left}
      </LeftColumn>

      <RightColumn>
        {right}
      </RightColumn>
    </MainContainer>
  )
}

export default TwoColumnHero
