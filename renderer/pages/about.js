/* global require */
import React from 'react'

import Layout from '../components/Layout'

import {
  Heading,
  Text,
  Code
} from 'ooni-components'

const { remote } = require('electron')

class About extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      debugPaths: {}
    }
  }

  componentDidMount() {
    const paths = remote.require('./utils/paths')
    this.setState({
      debugPaths: paths.debugGetAllPaths()
    })
  }

  render() {
    const {
      debugPaths
    } = this.state

    return (
      <Layout>
        <div>
          <Heading h={3}>This is a BETA version of OONI Probe</Heading>
          <Text>We may, before the final release, ask you as a beta app user to
          delete your OONI_HOME directory or may delete it automatically once
          you install the next stable release, so do not store sensitive data in
          here</Text>

          <Heading h={4}>Debug information</Heading>
          <div>
            {Object.keys(debugPaths).map(key => {
              return (
                <div key={key}>
                  <Text bold>{key}</Text>
                  <Code>{debugPaths[key]}</Code>
                </div>
              )
            })}
          </div>
        </div>
      </Layout>
    )
  }
}

export default About
