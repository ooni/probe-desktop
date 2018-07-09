import React from 'react'

import { Provider, theme } from 'ooni-components'
import withSentry from './withSentry'

const Layout = props => (
  <main>
    <Provider theme={theme}>
      { props.children }
    </Provider>
  </main>
)

export default withSentry(Layout)
