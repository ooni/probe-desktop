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
const { ipcRenderer } = require('electron')

import { version } from '../../package.json'

import styled from 'styled-components'

const UpdatesContainer = styled.div`
  padding-left: 20px;
  padding-top: 1px;
  padding-bottom: 30px;
  background-color: ${props => props.theme.colors.gray4};
`

const UpdateMessages = ({messages}) => {
  return (
    <UpdatesContainer>
      <Heading h={3}>Auto update</Heading>
      {messages.map((text) => (
        <Text>{text}</Text>
      ))}
    </UpdatesContainer>
  )
}

class About extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      debugPaths: {},
      msg: '',
      updateMessages: []
    }
    this.onReset = this.onReset.bind(this)
    this.onUpdateMessage = this.onUpdateMessage.bind(this)
  }

  onReset() {
    const { hardReset } = remote.require('./actions')
    hardReset().then(() => {
      this.setState({
        msg: 'Successfully reset OONI Probe. Please close and re-open the application.'
      })
    })
  }

  onUpdateMessage(event, text) {
    this.setState({
      updateMessages: [...this.state.updateMessages, text]
    })
  }

  componentDidMount() {
    const paths = remote.require('./utils/paths')
    this.setState({
      debugPaths: paths.debugGetAllPaths()
    })
    ipcRenderer.on('update-message', this.onUpdateMessage)

  }
  componentWillUnmount() {
    ipcRenderer.removeListener('update-message', this.onUpdateMessage)
  }

  render() {
    const {
      debugPaths,
      msg,
      updateMessages
    } = this.state

    return (
      <Layout>
        <Flex flexDirection='column' alignItems='center' bg='blue5' py={5}>
          <Box>
            <OONIHorizontalMonochromeInverted width='200px' />
          </Box>
          <Box mt={3}>
            <Text fontSize={14} color='white'>{version}</Text>
          </Box>
        </Flex>
        <Container>
          {updateMessages.length > 0
          && <UpdateMessages messages={updateMessages} />}

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
