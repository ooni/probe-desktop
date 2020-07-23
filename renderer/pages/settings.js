import React, { useEffect, useState, useCallback } from 'react'
import electron from 'electron'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'
import {
  Flex,
  Box,
  Heading,
  Container,
  Text,
} from 'ooni-components'

import { LocaleString, BooleanOption, NumberOption } from '../components/settings/widgets'
import Layout from '../components/Layout'
import Sidebar from '../components/Sidebar'
import { default as pkgJson } from '../../package.json'

const TopBar = styled.div`
  background-color: ${props => props.theme.colors.blue5};
  color: ${props => props.theme.colors.white};
  width: 100%;
  padding-top: 20px;
  padding-bottom: 20px;
  -webkit-app-region: drag;
`

const Settings = () => {
  const [config, setConfig] = useState(null)

  const reloadConfig = useCallback(async () => {
    const remote = electron.remote
    const { getConfig } = remote.require('./utils/config')
    const config = await getConfig()
    setConfig(config)
  }, [])

  useEffect(() => {
    reloadConfig()
  }, [])

  return (
    <Layout>
      <Sidebar>
        <Box width={1}>
          <TopBar>
            <Flex alignItems='center'>
              <Box pl={3}>
                <Heading h={3}><FormattedMessage id='Settings.Title' /></Heading>
              </Box>
            </Flex>
          </TopBar>
          {config && <Container pt={3}>
            <Heading h={4}><FormattedMessage id='Settings.Sharing.Label' /></Heading>
            <Flex flexDirection='column'>

              <BooleanOption
                onConfigSet={reloadConfig}
                label={<FormattedMessage id='Settings.Sharing.UploadResults' />}
                optionKey='sharing.upload_results'
                config={config}
              />

              <BooleanOption
                onConfigSet={reloadConfig}
                label={<FormattedMessage id='Settings.Sharing.IncludeNetwork' />}
                optionKey='sharing.include_asn'
                config={config}
              />

              <BooleanOption
                onConfigSet={reloadConfig}
                label={<FormattedMessage id='Settings.Sharing.IncludeIP' />}
                optionKey='sharing.include_ip'
                config={config} />

              <NumberOption
                onConfigSet={reloadConfig}
                label={<FormattedMessage id='Settings.Websites.TestCount' />}
                optionKey='nettests.websites_url_limit'
                config={config}
              />

              <BooleanOption
                onConfigSet={reloadConfig}
                label={<FormattedMessage id='Settings.Advanced.CollectAnalytics' />}
                optionKey='advanced.collect_usage_stats'
                config={config}
              />

            </Flex>
            <Text my={3}><LocaleString /></Text>
            <Text my={3}>OONI Probe Desktop v{pkgJson.version}</Text>
          </Container>}
        </Box>
      </Sidebar>
    </Layout>
  )
}

export default Settings
