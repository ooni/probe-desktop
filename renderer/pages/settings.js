import React from 'react'

import Link from 'next/link'

import Layout from '../components/Layout'
import Sidebar from '../components/SideBar'

import styled from 'styled-components'

import {
  Button,
  Container,
  Box,
  Flex,
  Heading
} from 'ooni-components'

class Settings extends React.Component {
  render() {
    return (
      <Layout>
        <Sidebar currentUrl={this.props.url}>
          <Heading h={1}>Welcome to OONI Probe!</Heading>
        </Sidebar>
      </Layout>
    )
  }
}

export default Settings
