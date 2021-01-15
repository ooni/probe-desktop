import React from 'react'
import styled from 'styled-components'
import { Flex, Button } from 'ooni-components'
import { FormattedMessage } from 'react-intl'
import { MdAdd } from 'react-icons/md'

const AddUrlButton = ({ onClick }) => (
  <Button hollow onClick={onClick}>
    <Flex alignItems='center'>
      <MdAdd size={24} /><FormattedMessage id='Dashboard.ChooseWebsites.Button.AddUrl' />
    </Flex>
  </Button>
)

export default AddUrlButton
