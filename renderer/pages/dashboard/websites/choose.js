import React from 'react'
import { useRouter } from 'next/router'
import { Hero, Container, Flex, Box } from 'ooni-components'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'

import Layout from 'components/Layout'
import Sidebar from 'components/Sidebar'
import BackButton from 'components/BackButton'
import UrlList from 'components/dashboard/UrlList'

const StyledHero = styled(Hero)`
  -webkit-app-region: drag;
  /* Hero has Container that has a default padding */
  ${Container} {
    padding-left: 0;
  }
`

const temporaryTestList = [
  'https://ooni.org',
  'https://thepiratebay.org',
  'https://explorer.ooni.org'
]

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
        <Container>
          <UrlList incomingList={temporaryTestList} />
        </Container>
      </Sidebar>
    </Layout>
  )
}

export default TestChosenWebsites
