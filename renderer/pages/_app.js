import React from 'react'
import * as Sentry from '@sentry/node'
import IntlProvider from '../components/IntlProvider'

import { ConfigProvider } from '../components/settings/useConfig'

Sentry.init({
  dsn: 'https://e1eef2aaa6054d94bffc4a648fb78f09@sentry.io/1210892',
})

const MyApp = ({ Component, pageProps, err }) => {

  // Workaround for https://github.com/zeit/next.js/issues/8592
  const modifiedPageProps = { ...pageProps, err }

  return (
    <ConfigProvider>
      <IntlProvider>
        <Component {...modifiedPageProps} />
      </IntlProvider>
    </ConfigProvider>
  )
}

export default MyApp
