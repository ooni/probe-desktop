/* global require */
import React from 'react'

import Layout from '../components/Layout'

import OONIVerticalColor from 'ooni-components/components/svgs/logos/OONI-VerticalColor.svg'
import {
  Button,
  Heading,
  Text,
  Flex,
  Box,
  Code
} from 'ooni-components'

const { remote } = require('electron')

class About extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      debugPaths: {},
      msg: ''
    }
    this.onReset = this.onReset.bind(this)
  }

  onReset() {
    const { hardReset } = remote.require('./actions')
    hardReset().then(() => {
      this.setState({
        msg: 'Successfully reset OONI Probe. Please close and re-open the application.'
      })
    })
  }

  componentDidMount() {
    const paths = remote.require('./utils/paths')
    this.setState({
      debugPaths: paths.debugGetAllPaths()
    })
  }

  render() {
    const {
      debugPaths,
      msg
    } = this.state

    return (
      <Layout>
        <div style={{padding: '20px'}}>
          <Flex justify='center' align='center'>
            <Box><OONIVerticalColor width='100px' /></Box>
          </Flex>
          {msg && <Heading h={4} color='red5'>{msg}</Heading>}

          <Heading h={3} center>This is a BETA!</Heading>
          <Text>When you install the final release please be sure to do a hard
          reset by clicking on the button below.</Text>
          <Text bold>Do not rely on this version keeping your data</Text>
          <Text>If you encounter any bugs with it please report them via email
          to contact@openobservatory.org or (even better) on
          github.com/ooni/probe-desktop</Text>

          <Flex justify='center' align='center' pt={2}>
            <Box>
              <Button onClick={this.onReset}>Hard reset</Button>
            </Box>
          </Flex>

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
