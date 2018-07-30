import React from 'react'

import styled from 'styled-components'

import Layout from '../components/Layout'
import Sections from '../components/onboard/Sections'

const TopBar = styled.div`
  height: 50px;
  background-color: ${props => props.theme.colors.gray6};
  color: ${props => props.theme.colors.white};
  /* This makes it possible to drag the window around from the side bar */
  -webkit-app-region: drag;
`

const SectionContainer = styled.div`
  min-height: 100%;
  width: 100%;
  background-color: ${props => props.theme.colors.blue6};
  color: ${props => props.theme.colors.white};
`

const Onboard = () => (
  <Layout>
    <SectionContainer>
      <TopBar />
      <Sections
        onGo={() => console.log('on go')}
        onChange={() => console.log('on change')}
      />
    </SectionContainer>
  </Layout>
)

export default Onboard
