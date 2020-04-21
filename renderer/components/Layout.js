import React from 'react'
import { Provider, theme } from 'ooni-components'
import { MatomoProvider, createInstance } from '@datapunt/matomo-tracker-react'

import withIntl from './withIntl'
import GlobalStyle from './globalStyle'
import MatomoTracker from './MatomoTracker'

let matomoInstance

if (typeof window !== 'undefined') {
  matomoInstance = createInstance({
    urlBase: 'https://matomo.ooni.org/',
    siteId: 3, // optional, default value: `1`
    trackerUrl: 'https://matomo.ooni.org/matomo.php',
    srcUrl: 'https://matomo.ooni.org/matomo.js',
  })
}

const Layout = props => (
  <MatomoProvider value={matomoInstance}>
    <Provider theme={theme}>
      <GlobalStyle />
      <MatomoTracker />
      { props.children }
    </Provider>
  </MatomoProvider>
)

export default withIntl(Layout)
