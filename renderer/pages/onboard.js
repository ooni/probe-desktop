import React from 'react'

import Link from 'next/link'

import Layout from '../components/Layout'

import styled from 'styled-components'

import {
  Hero,
  HeroLead,
  LogoOONIRun,
  Button,
  Container,
  Box,
  Flex,
  Heading
} from 'ooni-components'

class Sections extends React.Component {
  render() {
    return (
      <Flex>
      <Button>Click me</Button>
      </Flex>
    )
  }
}

const Onboard = () => (
  <Layout>
    <Heading h={1}>Welcome to OONI Probe!</Heading>
    <Sections />
  </Layout>
)

export default Onboard
