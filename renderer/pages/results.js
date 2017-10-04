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
  Heading,
  Text
} from 'ooni-components'

class Results extends React.Component {
  render() {
    return (
      <Layout>
        <Sidebar currentUrl={this.props.url}>
          <Container pt={3}>
            <Text>These are the OONI Probe measurements gathered</Text>
            <Heading h={1}>XXX</Heading>
          </Container>
        </Sidebar>
      </Layout>
    )
  }
}

export default Results
