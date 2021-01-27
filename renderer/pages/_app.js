import React from 'react'
import IntlProvider from '../components/IntlProvider'
import '../../main/utils/sentry.js'
import { ConfigProvider } from '../components/settings/useConfig'

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
