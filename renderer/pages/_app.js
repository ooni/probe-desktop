import React from 'react'
import { init as initSentry } from '../components/initSentry'
import IntlProvider from '../components/IntlProvider'
import { ConfigProvider } from '../components/settings/useConfig'

const MyApp = ({ Component, pageProps, err }) => {

  // Workaround for https://github.com/zeit/next.js/issues/8592
  const modifiedPageProps = { ...pageProps, err }
  initSentry()

  return (
    <ConfigProvider>
      <IntlProvider>
        <Component {...modifiedPageProps} />
      </IntlProvider>
    </ConfigProvider>
  )
}

export default MyApp
