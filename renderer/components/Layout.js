import React, { useCallback, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { theme } from 'ooni-components'
import { ThemeProvider } from 'styled-components'
import { MatomoProvider, createInstance } from '@datapunt/matomo-tracker-react'
import { ipcRenderer } from 'electron'

import GlobalStyle from './globalStyle'
import MatomoTracker from './MatomoTracker'
import { init as initSentry } from '../components/initSentry'
import AutorunConfirmation from './AutorunConfirmation'

let matomoInstance

if (typeof window !== 'undefined') {
  matomoInstance = createInstance({
    urlBase: 'https://matomo.ooni.org/',
    siteId: 3, // optional, default value: `1`
    trackerUrl: 'https://matomo.ooni.org/matomo.php',
    srcUrl: 'https://matomo.ooni.org/matomo.js',
  })
}

const Layout = ({ children, analytics = true }) => {
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
    <MatomoProvider value={matomoInstance}>
      <ThemeProvider theme={theme}>
        <GlobalStyle />
        {analytics && <MatomoTracker />}
        {children}
        <AutorunConfirmation show={showPrompt} onClose={hideAutomaticTestPrompt} />
      </ThemeProvider>
    </MatomoProvider>
  )
}

Layout.propTypes = {
  children: PropTypes.element.isRequired,
  analytics: PropTypes.bool
}

export default Layout
