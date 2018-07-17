import React from 'react'

import withIntl from './withIntl'
import { Provider, theme } from 'ooni-components'

const Layout = props => (
  <main>
    <Provider theme={theme}>
      { props.children }
    </Provider>
  </main>
)

export default withIntl(Layout)
