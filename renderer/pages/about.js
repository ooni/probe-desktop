/* global require */
import React from 'react'

import Layout from '../components/Layout'
import FormattedMarkdownMessage from '../components/FormattedMarkdownMessage'

import OONIHorizontalMonochromeInverted from 'ooni-components/components/svgs/logos/OONI-HorizontalMonochromeInverted.svg'
import {
  Container,
  Button,
  Heading,
  Flex,
  Box,
  Code
} from 'ooni-components'

import { Text } from 'rebass'

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
        <Flex flexDirection='column' alignItems='center' bg='blue5' py={5}>
          <Box>
            <OONIHorizontalMonochromeInverted width='200px' />
          </Box>
          <Box mt={3}>
            <Text fontSize={14} color='white'>{remote.app.getVersion()}</Text>
          </Box>
        </Flex>
        <Container>
          <Text>
            <FormattedMarkdownMessage id='Settings.About.Content.Paragraph' />
          </Text>


          <Flex justifyContent='center' alignItems='center' pt={2}>
            <Box>
              <Button onClick={this.onReset}>Hard reset</Button>
            </Box>
          </Flex>
          <Flex flexDirection='column' my={2}>
            <Box>
              <Heading textAlign='center' h={4}>Debug information</Heading>
            </Box>
            <Box bg='gray1' p={2}>
              {Object.keys(debugPaths).map(key => {
                return (
                  <Flex key={key} flexDirection='column' mb={3}>
                    <Box>
                      <Text fontWeight='bold'>{key}</Text>
                    </Box>
                    <Box>
                      <Code>{debugPaths[key]}</Code>
                    </Box>
                  </Flex>
                )
              })}
            </Box>
          </Flex>

          {msg && <Heading h={4} color='red5'>{msg}</Heading>}
        </Container>
      </Layout>
    )
  }
}

export default About
