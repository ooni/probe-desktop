import React from 'react'
import { useRouter } from 'next/router'
import { Hero, Container, Flex, Box } from 'ooni-components'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'

import Layout from 'components/Layout'
import Sidebar from 'components/Sidebar'
import BackButton from 'components/BackButton'

const StyledHero = styled(Hero)`
  -webkit-app-region: drag;
  /* Hero has Container that has a default padding */
  ${Container} {
    padding-left: 0;
  }
`

const TestChosenWebsites = () => {
  const router = useRouter()
  return (
    <Layout>
      <Sidebar>
        <StyledHero py={3}>
          <Flex justifyContent='center' alignItems='center'>
            <Box mr='auto'>
              <BackButton size={24} onClick={() => router.back()}/>
            </Box>
            <Box mr='auto'>
              <FormattedMessage id='Settings.Websites.CustomURL.Title' />
            </Box>
          </Flex>
        </StyledHero>
        Run Chosen Websites
      </Sidebar>
    </Layout>
  )
}

export default TestChosenWebsites
