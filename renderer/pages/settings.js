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

import { ConfigProvider } from '../components/settings/useConfig'
import { BooleanOption, NumberOption } from '../components/settings/widgets'
import { LanguageSelector } from '../components/settings/LanguageSelector'
import { WebsiteCategoriesSelector } from '../components/settings/WebsiteCategoriesSelector'
import { StorageManagement } from '../components/settings/StorageManagement'
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

const SectionHeading = styled(Heading)`
  border-bottom: 1px solid ${props => props.theme.colors.gray6};
`

const Section = ({ title, children }) => (
  <Flex flexDirection='column' my={3}>
    <SectionHeading h={4} pb={2}>{title}</SectionHeading>
    {children}
  </Flex>
)

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
  }, [reloadConfig])

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
          <Container pt={3}>
            <ConfigProvider>
              <LanguageSelector />

              {/* Test Options */}
              <Section title={<FormattedMessage id='Settings.TestOptions.Label' />}>
                <Heading h={5}><FormattedMessage id='Test.Websites.Fullname' /></Heading>
                <WebsiteCategoriesSelector />
                <NumberOption
                  onConfigSet={reloadConfig}
                  label={<FormattedMessage id='Settings.Websites.TestCount' />}
                  optionKey='nettests.websites_url_limit'
                  config={config}
                />
              </Section>

              {/* Stoage Usage */}
              <Section title={<FormattedMessage id='Settings.Storage.Label' />}>
                <StorageManagement />
              </Section>

              {/* Privacy */}
              <Section title={<FormattedMessage id='Settings.Privacy.Label' />}>
                <BooleanOption
                  label={<FormattedMessage id='Settings.Privacy.CollectAnalytics' />}
                  optionKey='advanced.collect_usage_stats'
                />
                <BooleanOption
                  label={<FormattedMessage id='Settings.Sharing.UploadResults' />}
                  optionKey='sharing.upload_results'
                />
                <BooleanOption
                  label={<FormattedMessage id='Settings.Sharing.IncludeNetwork' />}
                  optionKey='sharing.include_asn'
                />
                <BooleanOption
                  label={<FormattedMessage id='Settings.Sharing.IncludeIP' />}
                  optionKey='sharing.include_ip'
                />
              </Section>

              <Text my={3}>OONI Probe Desktop v{pkgJson.version}</Text>

            </ConfigProvider>
          </Container>
        </Box>
      </Sidebar>
    </Layout>
  )
}

export default Settings
