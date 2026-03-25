import React, { useCallback, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { theme } from 'ooni-components'
import { StyleSheetManager, ThemeProvider } from 'styled-components'
import stylisRTLPlugin from 'stylis-plugin-rtl'
import { ipcRenderer } from 'electron'
import { useIntl } from 'react-intl'

import GlobalStyle from './globalStyle'
import { init as initSentry } from '../components/initSentry'
import AutorunConfirmation from './AutorunConfirmation'
import BetaUpdateConfirmation from './BetaUpdateConfirmation'


const Layout = ({ children }) => {
  const [showPrompt, setShowPrompt] = useState(false)
  const [showBetaUpdate, setShowBetaUpdate] = useState(false)

  useEffect(() => {
    initSentry()
    // Prepare to show prompt when main process signals back
    ipcRenderer.on('autorun.showPrompt', showAutomaticTestPrompt)

    const onShowBetaUpdate = () => setShowBetaUpdate(true)
    window.addEventListener('show-beta-update', onShowBetaUpdate)

    return () => {
      ipcRenderer.removeAllListeners('autorun.showPrompt')
      window.removeEventListener('show-beta-update', onShowBetaUpdate)
    }
  }, [showAutomaticTestPrompt])

  const showAutomaticTestPrompt = useCallback(() => {
    setShowPrompt(true)
  }, [setShowPrompt])

  const hideAutomaticTestPrompt = useCallback(() => {
    setShowPrompt(false)
  }, [setShowPrompt])

  const hideBetaUpdate = useCallback(() => {
    setShowBetaUpdate(false)
  }, [setShowBetaUpdate])

  // This flag activates the stylisRTLPlugin.
  // It is also inserted into the theme context for any component to consume
  const { isRTL } = useIntl()

  return (
    <StyleSheetManager stylisPlugins={isRTL ? [stylisRTLPlugin] : []}>
      <ThemeProvider theme={{...theme, isRTL}}>
        <GlobalStyle />
        {children}
        <AutorunConfirmation show={showPrompt} onClose={hideAutomaticTestPrompt} />
        <BetaUpdateConfirmation show={showBetaUpdate} onClose={hideBetaUpdate} />
      </ThemeProvider>
    </StyleSheetManager>
  )
}

Layout.propTypes = {
  children: PropTypes.element.isRequired
}

export default Layout
