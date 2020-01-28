import React from 'react'

import withIntl from './withIntl'
import GlobalStyle from './globalStyle'
import { Provider, theme } from 'ooni-components'

const Layout = props => (
  <main>
    <Provider theme={theme}>
      <GlobalStyle />
      { props.children }
    </Provider>
  </main>
)

export default withIntl(Layout)
