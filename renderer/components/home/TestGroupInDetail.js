import React from 'react'
import PropTypes from 'prop-types'
import { Flex, Box, Text, Heading, Button } from 'ooni-components'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'

import { testGroups } from '../nettests'
import BackButton from '../BackButton'

const Divider = styled(Box)`
  height: 1px;
  background-color: white;
  width: 100%;
`

const BoldButton = styled(Button)`
  font-weight: bolder;
`

const TestGroupInDetail = ({ onRun, testGroup, onBack, onChooseWebsites }) => {
  const { name, icon, longDescription, color } = testGroups[testGroup]
  return (
    <Flex flexDirection='column'>
      <Flex bg={color} color='white' py={3}>
        <Box>
          <BackButton onBack={onBack} size={24} />
        </Box>
        <Box>
          {React.cloneElement(icon, {
            size: 96
          })}
        </Box>
        <Box width={1}>
          <Flex flexDirection='column' mx={3}>
            <Flex justifyContent='space-between'>
              <Heading h={3}>
                {name}
              </Heading>
              <BoldButton inverted onClick={onRun} width={1/5} ml='auto'>
                <FormattedMessage id='Dashboard.Overview.Run' />
              </BoldButton>
              {onChooseWebsites && (
                <BoldButton hollow inverted onClick={onChooseWebsites} ml={3}>
                  <FormattedMessage id='Dashboard.Overview.ChooseWebsites' />
                </BoldButton>
              )}
            </Flex>
            <Divider my={2} />
            <Flex my={2}>
              <Box mr={3}>
                <FormattedMessage id='Dashboard.Overview.Estimated' />
                <strong> ~XXXX MB ~1️⃣2️⃣0️⃣s </strong>
              </Box>
              <Box mr={3}>
                <FormattedMessage id='Dashboard.Overview.LatestTest' />
                <strong> 🐙 ~8MB ~120s </strong>
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
  onBack: PropTypes.func,
  onChooseWebsites: PropTypes.func
}

export default TestGroupInDetail
