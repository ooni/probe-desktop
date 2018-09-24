import React from 'react'
import { configure, addDecorator } from '@storybook/react'
import { ThemeProvider } from 'styled-components'

import { IntlProvider } from 'react-intl'

import { theme } from 'ooni-components'

// automatically import all files ending in *.stories.js
const req = require.context('../stories', true, /.stories.js$/)
const loadStories = () => req.keys().forEach(filename => req(filename))

addDecorator((story) => (
  <IntlProvider>
    <ThemeProvider theme={theme}>
    {story()}
    </ThemeProvider>
  </IntlProvider>
))

configure(loadStories, module)
