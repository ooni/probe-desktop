/* global require */
import React from 'react'

import Router from 'next/router'

import styled from 'styled-components'

import Layout from '../components/Layout'
import Sections from '../components/onboard/Sections'

const TopBar = styled.div`
  height: 50px;
  background-color: ${props => props.theme.colors.blue6};
  color: ${props => props.theme.colors.white};
  /* This makes it possible to drag the window around from the side bar */
  -webkit-app-region: drag;
`

const SectionContainer = styled.div`
  min-height: 100vh;
  background-color: ${props => props.theme.colors.blue6};
  color: ${props => props.theme.colors.white};
`

const OnboardingComplete = () => {
  const { remote } = require('electron')
  return remote.require('./utils/ooni/onboard')()
}

const onGo = () => {
  OnboardingComplete().then(() => {
    Router.push('/home')
  })
}

const onChange = () => {
  OnboardingComplete().then(() => {
    Router.push('/settings')
  })
}

const Onboard = () => (
  <Layout>
    <SectionContainer>
      <TopBar />
      <Sections
        onGo={onGo}
        onChange={onChange}
      />
    </SectionContainer>
  </Layout>
)

export default Onboard
