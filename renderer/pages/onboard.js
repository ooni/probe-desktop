/* global require */
import React from 'react'

import Router from 'next/router'

import styled from 'styled-components'

import Layout from '../components/Layout'
import Sections from '../components/onboard/Sections'

const SectionContainer = styled.div`
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
      <Sections
        onGo={onGo}
        onChange={onChange}
      />
    </SectionContainer>
  </Layout>
)

export default Onboard
