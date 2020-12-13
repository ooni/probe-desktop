import React, { useState, useMemo, useCallback } from 'react'
import { FormattedMessage } from 'react-intl'
import {
  Flex,
  Button,
  Text
} from 'ooni-components'
import electron from 'electron'
import humanize from 'humanize'
import { RemoveScroll } from 'react-remove-scroll'
import Raven from 'raven-js'

import ConfirmationModal from '../ConfirmationModal'
import FormattedMarkdownMessage from '../FormattedMarkdownMessage'

export const StorageManagement = () => {
  const [showModal, setShowModal] = useState(false)
  const [refreshSizeCounter, setRefreshSizeCounter] = useState(0)

  const onDelete = useCallback(() => {
    const remote = electron.remote
    const { deleteResult } = remote.require('./actions')
    deleteResult().then(() => {
      setRefreshSizeCounter(prev => prev + 1)
    }).catch(err => {
      Raven.captureException(err, {extra: {scope: 'renderer.deleteAllMeasurements'}})
    })
  }, [setRefreshSizeCounter])

  const homeDirSize = useMemo(() => {
    const remote = electron.remote
    const { getHomeDirSize } = remote.require('./utils/paths')
    const homeDirSize = humanize.filesize(getHomeDirSize())
    return homeDirSize
  }, [refreshSizeCounter]) // dependency to auto update size when counter changes

  return (
    <Flex flexDirection='column'>
      <Flex my={2}>
        <Text><FormattedMessage id='Settings.Storage.Usage.Label' /></Text>
        <Text color='gray6' ml={4}>{homeDirSize}</Text>
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
