import React from 'react'

import { Provider, theme } from 'ooni-components'

const Layout = props => (
  <div>
    <Provider theme={theme}>
      { props.children }
    </Provider>
  </div>
)
export default Layout
