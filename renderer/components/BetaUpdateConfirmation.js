import React, { useCallback } from 'react'
import PropTypes from 'prop-types'
import { Modal, Container, Flex, Button, Heading } from 'ooni-components'
import { FormattedMessage } from 'react-intl'
import { MdClose } from 'react-icons/md'
import { shell } from 'electron'

import { StyledCloseButton } from './ConfirmationModal'
import FormattedMarkdownMessage from './FormattedMarkdownMessage'
import { setRemindLater, DOWNLOAD_URL } from './betaUpdateConfig'

const BetaUpdateConfirmation = ({ show, onClose }) => {
  const onDownload = useCallback(() => {
    shell.openExternal(DOWNLOAD_URL)
    onClose()
  }, [onClose])

  const onRemindLater = useCallback(() => {
    setRemindLater()
    onClose()
  }, [onClose])

  return (
    <Modal width='60%' show={show}>
      <StyledCloseButton onClick={onClose}><MdClose size={24} /></StyledCloseButton>
      <Container>
        <Heading h={4} my={3} textAlign='center'>
          <FormattedMessage id='Modal.BetaUpdate.Title' />
        </Heading>
        <Flex>
          <FormattedMarkdownMessage id='Modal.BetaUpdate.Text' />
        </Flex>
        <Flex justifyContent='flex-end' my={3}>
          <Button ml={2} inverted onClick={onClose}>
            <strong><FormattedMessage id='Modal.NoThanks' /></strong>
          </Button>
          <Button ml={2} inverted onClick={onRemindLater}>
            <strong><FormattedMessage id='Modal.BetaUpdate.Button.RemindLater' /></strong>
          </Button>
          <Button ml={2} onClick={onDownload}>
            <strong><FormattedMessage id='Modal.BetaUpdate.Button.Download' /></strong>
          </Button>
        </Flex>
      </Container>
    </Modal>
  )
}

BetaUpdateConfirmation.propTypes = {
  onClose: PropTypes.func,
  show: PropTypes.bool.isRequired
}

export default BetaUpdateConfirmation
