/* global require */
import React, { useCallback } from 'react'

import Router from 'next/router'

import styled from 'styled-components'

import Layout from '../components/Layout'
import Sections from '../components/onboard/Sections'

const SectionContainer = styled.div`
  color: ${props => props.theme.colors.white};
`

const Onboard = () => {

  const OnboardingComplete = useCallback(() => {
    const { remote } = require('electron')
    return remote.require('./utils/ooni/onboard')()
  }, [])

  const onGo = useCallback(() => {
    OnboardingComplete().then(() => {
      Router.push('/dashboard')
    })
  }, [])

  const onChange = useCallback(() => {
    OnboardingComplete().then(() => {
      Router.push('/settings')
    })
  }, [])

  return (
    <Layout analytics={false}>
      <SectionContainer>
        <Sections
          onGo={onGo}
          onChange={onChange}
        />
      </SectionContainer>
    </Layout>
  )
}

export default Onboard
