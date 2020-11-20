import React, { useState, useMemo, useCallback } from 'react'
import { FormattedMessage } from 'react-intl'
import {
  Flex, Box,
  Label,
  Button,
  Text,
  Modal,
  Container,
  Heading
} from 'ooni-components'
import styled from 'styled-components'
import electron from 'electron'
import { RemoveScroll } from 'react-remove-scroll'

import ConfirmationModal from '../ConfirmationModal'
import FormattedMarkdownMessage from '../FormattedMarkdownMessage'

export const StorageManagement = () => {
  const [showModal, setShowModal] = useState(false)
  const onDelete = useCallback(() => {
    alert('Deleted All Measurements')
  }, [])
  return (
    <Flex flexDirection='column'>
      <Flex my={2}>
        <Text><FormattedMessage id='Settings.Storage.Usage.Label' /></Text>
        <Text color='gray6' ml={4}>100 MB</Text>
      </Flex>
      <Flex my={2}>
        <Button onClick={() => setShowModal(true)}>
          <FormattedMessage id='Settings.Storage.Delete'/>
        </Button>
      </Flex>
      <RemoveScroll enabled={showModal}>
        <ConfirmationModal
          show={showModal}
          title={<FormattedMessage id='Settings.Storage.Confirmation.Title' />}
          body={<FormattedMarkdownMessage id='Settings.Storage.Confirmation.Paragraph' />}
          confirmLabel={<FormattedMessage id='Modal.Delete' />}
          cancelLabel={<FormattedMessage id='Modal.Cancel' />}
          onConfirm={() => {
            onDelete()
            setShowModal(false)
          }}
          onCancel={() => setShowModal(false)}
        />
      </RemoveScroll>

    </Flex>
  )
}

export default StorageManagement
