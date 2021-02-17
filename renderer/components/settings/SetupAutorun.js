import React, { useCallback } from 'react'
import { ipcRenderer } from 'electron'
import { useIntl } from 'react-intl'
import { Box, Button } from 'ooni-components'

const SetupAutorun = () => {
  const intl = useIntl()
  const onClick = useCallback(() => {
    ipcRenderer.send('autorun.schedule', {
      dialogTitle: intl.formatMessage({ id: 'Settings.Autorun.Title' }),
      dialogMessage: intl.formatMessage({ id: 'Settings.Autorun.Message' }),
      btnYes: intl.formatMessage({ id: 'Settings.Autorun.Button.Yes' }),
      btnNo: intl.formatMessage({ id: 'Settings.Autorun.Button.No' }),
    })
  })
  return (
    <Box>
      <Button onClick={onClick}>
        {intl.formatMessage({ id: 'Settings.Autorun.Button.Label' })}
      </Button>
    </Box>
  )
}

export default SetupAutorun