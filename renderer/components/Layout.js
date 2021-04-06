import React, { useCallback, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { theme } from 'ooni-components'
import { ThemeProvider } from 'styled-components'
import { ipcRenderer } from 'electron'

import GlobalStyle from './globalStyle'
import { init as initSentry } from '../components/initSentry'
import AutorunConfirmation from './AutorunConfirmation'

const Layout = ({ children }) => {
  const [showPrompt, setShowPrompt] = useState(false)
  useEffect(() => {
    initSentry()
    // Prepare to show prompt when main process signals back
    ipcRenderer.on('autorun.showPrompt', showAutomaticTestPrompt)

    return () => {
      ipcRenderer.removeAllListeners('autorun.showPrompt')
    }
  }, [showAutomaticTestPrompt])

  const showAutomaticTestPrompt = useCallback(() => {
    setShowPrompt(true)
  }, [setShowPrompt])

  const hideAutomaticTestPrompt = useCallback(() => {
    setShowPrompt(false)
  }, [setShowPrompt])


  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      {children}
      <AutorunConfirmation show={showPrompt} onClose={hideAutomaticTestPrompt} />
    </ThemeProvider>
  )
}

Layout.propTypes = {
  children: PropTypes.element.isRequired
}

export default Layout
