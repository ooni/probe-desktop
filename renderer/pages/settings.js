import electron from 'electron'
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

class Settings extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      config: {}
    }
  }

  componentDidMount() {
    const remote = electron.remote
    const { getConfig } = remote.require('./utils/config')

    getConfig().then(config => {
      this.setState({
        config
      })
    })
  }


  render() {
    const {
      config
    } = this.state

    return (
      <Layout>
        <Sidebar currentUrl={this.props.url}>
          <Heading h={3}>Config dump</Heading>
          <Text>
          {JSON.stringify(config, null, ' ')}
          </Text>
        </Sidebar>
      </Layout>
    )
  }
}

export default Settings
