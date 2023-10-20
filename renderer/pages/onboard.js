import React, { useCallback } from 'react'

import Router from 'next/router'
import styled from 'styled-components'

import Layout from '../components/Layout'
import Sections from '../components/onboard/Sections'

const SectionContainer = styled.div`
  color: ${props => props.theme.colors.white};
`

const Onboard = () => {

  const onGo = useCallback(async (crashReportsOptIn) => {
    await window.electron.config.onboard(crashReportsOptIn)
    Router.push('/dashboard')
  }, [])

  return (
    <Layout>
      <SectionContainer>
        <Sections
          onGo={onGo}
        />
      </SectionContainer>
    </Layout>
  )
}

export default Onboard
