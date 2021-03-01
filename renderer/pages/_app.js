import React from 'react'
import log from 'electron-log'
import IntlProvider from '../components/IntlProvider'
import { ConfigProvider } from '../components/settings/useConfig'

log.transports.console.level = 'info'
log.transports.file.level = 'debug'

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
