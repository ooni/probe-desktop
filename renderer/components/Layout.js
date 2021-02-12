import React from 'react'
import PropTypes from 'prop-types'
import { Provider, theme } from 'ooni-components'
import { MatomoProvider, createInstance } from '@datapunt/matomo-tracker-react'

import GlobalStyle from './globalStyle'
import MatomoTracker from './MatomoTracker'
import { init as initSentry } from '../components/initSentry'

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
  initSentry()
  return (
    <MatomoProvider value={matomoInstance}>
      <Provider theme={theme}>
        <GlobalStyle />
        {analytics && <MatomoTracker />}
        {children}
      </Provider>
    </MatomoProvider>
  )
}

Layout.propTypes = {
  children: PropTypes.element.isRequired,
  analytics: PropTypes.bool
}

export default Layout
