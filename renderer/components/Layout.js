import React, { useCallback, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { theme } from 'ooni-components'
import { StyleSheetManager, ThemeProvider } from 'styled-components'
import stylisRTLPlugin from 'stylis-plugin-rtl'
import { useIntl } from 'react-intl'

import GlobalStyle from './globalStyle'
// import { init as initSentry } from '../components/initSentry'
import AutorunConfirmation from './AutorunConfirmation'


const Layout = ({ children }) => {
  const [showPrompt, setShowPrompt] = useState(false)
  
  const showAutomaticTestPrompt = useCallback(() => {
    setShowPrompt(true)
  }, [setShowPrompt])

  const hideAutomaticTestPrompt = useCallback(() => {
    setShowPrompt(false)
  }, [setShowPrompt])

  useEffect(() => {
    // initSentry()
    // Prepare to show prompt when main process signals back
    const removeShowPromptListeners = window.electron.autorun.showPrompt(showAutomaticTestPrompt)

    return () => {
      removeShowPromptListeners()
    }
  }, [showAutomaticTestPrompt])

  // This flag activates the stylisRTLPlugin.
  // It is also inserted into the theme context for any component to consume
  const { isRTL } = useIntl()

  return (
    <StyleSheetManager stylisPlugins={isRTL ? [stylisRTLPlugin] : []}>
      <ThemeProvider theme={{...theme, isRTL}}>
        <GlobalStyle />
        {children}
        <AutorunConfirmation show={showPrompt} onClose={hideAutomaticTestPrompt} />
      </ThemeProvider>
    </StyleSheetManager>
  )
}

Layout.propTypes = {
  children: PropTypes.element.isRequired
}

export default Layout
