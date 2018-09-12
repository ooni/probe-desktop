import electron from 'electron'
import React from 'react'


import Layout from '../components/Layout'
import Sidebar from '../components/Sidebar'

import {
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
        <Sidebar>
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
