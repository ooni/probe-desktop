import React, { useCallback } from 'react'
import PropTypes from 'prop-types'
import { Flex, Box, Heading, Button } from 'ooni-components'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'
import moment from 'moment'
import { useRouter } from 'next/router'

import { testGroups } from '../nettests'
import BackButton from '../BackButton'
import { useConfig } from '../settings/useConfig'
import LastTest from 'components/dashboard/LastTest'

const Divider = styled(Box)`
  height: 1px;
  background-color: white;
  width: 100%;
`

const BoldButton = styled(Button)`
  font-weight: bolder;
`

const TestGroupInDetail = ({ onRun, testGroup }) => {
  const { name, icon, longDescription, color, estimatedSize, estimatedTimeInSec } = testGroups[testGroup]
  const router = useRouter()
  const [maxRuntimeEnabled,] = useConfig('nettests.websites_enable_max_runtime')
  const [maxRuntime,] = useConfig('nettests.websites_max_runtime')
  const isWebsites =  testGroup === 'websites'
  const estimatedTimeReadable = moment.duration(estimatedTimeInSec(maxRuntimeEnabled ? maxRuntime : 0), 'seconds').humanize()

  const onChooseWebsites = useCallback(() => {
    router.push('/dashboard/websites/choose')
  }, [router])

  return (
    <Flex flexDirection='column'>
      <Flex bg={color} color='white' py={3}>
        <Box>
          <BackButton />
        </Box>
        <Box>
          {React.cloneElement(icon, {
            size: 96
          })}
        </Box>
        <Box width={1}>
          <Flex flexDirection='column' mx={3}>
            <Flex justifyContent='space-between' alignItems='center'>
              <Heading h={3}>
                {name}
              </Heading>
              <BoldButton inverted onClick={onRun} width={1/5} ml='auto'>
                <FormattedMessage id='Dashboard.Overview.Run' />
              </BoldButton>
              {isWebsites && (
                <BoldButton hollow inverted ml={3} onClick={onChooseWebsites}>
                  <FormattedMessage id='Dashboard.Overview.ChooseWebsites' />
                </BoldButton>
              )}
            </Flex>
            <Divider my={2} />
            <Flex my={2}>
              <Box mr={3}>
                <FormattedMessage id='Dashboard.Overview.Estimated' />
                <strong> {estimatedSize} ~{estimatedTimeReadable}</strong>
              </Box>
              <Box mr={3}>
                <LastTest testGroupName={testGroup} />
              </Box>
            </Flex>
          </Flex>
        </Box>
      </Flex>
      <Flex px={4}>
        {longDescription}
      </Flex>
    </Flex>
  )
}

TestGroupInDetail.propTypes = {
  testGroup: PropTypes.string.isRequired,
  onRun: PropTypes.func,
}

export default TestGroupInDetail
