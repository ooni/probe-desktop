import React from 'react'
import { Modal, Container, Flex, Button, Heading, Text } from 'ooni-components'
import { FormattedMessage } from 'react-intl'
import { MdClose } from 'react-icons/md'

import { StyledCloseButton } from './ConfirmationModal'
import FormattedMarkdownMessage from './FormattedMarkdownMessage'

const AutomaticTestingModal = () => {
  return (
    <Modal width='60%' show={false}>
      <StyledCloseButton onClick={() => {}}><MdClose size={24} /></StyledCloseButton>
      <Container>
        <Heading h={4} my={3} textAlign='center'>
          <FormattedMessage id='AutomaticTest.Modal.Title' />
        </Heading>
        <Flex>
          <Text><FormattedMarkdownMessage id='AutomaticTest.Modal.Text' /></Text>
        </Flex>
        <Flex justifyContent='flex-end' my={3}>
          <Button ml={2} inverted onClick={() => {}}>
            <strong><FormattedMessage id='AutomaticTest.Modal.Button.No' /></strong>
          </Button>
          <Button ml={2} inverted onClick={() => {}}>
            <strong><FormattedMessage id='AutomaticTest.Modal.Button.RemindLater' /></strong>
          </Button>
          <Button ml={2} onClick={() => {}}>
            <strong><FormattedMessage id='AutomaticTest.Modal.Button.Yes' /></strong>
          </Button>
        </Flex>
      </Container>
    </Modal>
  )
}

export default AutomaticTestingModal