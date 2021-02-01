import React from 'react'
import { Flex, Button } from 'ooni-components'
import { FormattedMessage } from 'react-intl'
import { MdAdd } from 'react-icons/md'

const AddUrlButton = ({ onClick }) => (
  <Button hollow onClick={onClick}>
    <Flex alignItems='center'>
      <MdAdd size={24} /><FormattedMessage id='Settings.Websites.CustomURL.Add' />
    </Flex>
  </Button>
)

export default AddUrlButton
