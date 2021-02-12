/* global require */
import React, { useCallback } from 'react'

import Router from 'next/router'
import { ipcRenderer } from 'electron'
import styled from 'styled-components'

import Layout from '../components/Layout'
import Sections from '../components/onboard/Sections'

const SectionContainer = styled.div`
  color: ${props => props.theme.colors.white};
`

const Onboard = () => {

  const onGo = useCallback(async () => {
    await ipcRenderer.invoke('config.onboard', {})
    Router.push('/dashboard')
  }, [])

  const onChange = useCallback(async () => {
    await ipcRenderer.invoke('config.onboard', { optout: true })
    Router.push('/settings')
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
