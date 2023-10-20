import React, { useEffect } from 'react'
import log from 'electron-log/renderer'
import IntlProvider from '../components/IntlProvider'
import { ConfigProvider } from '../components/settings/useConfig'
import '../components/global.css'
import { init as initSentry } from '../components/initSentry'

log.transports.console.level = process.env.NODE_ENV === 'development' ? 'debug' : 'info'

const MyApp = ({ Component, pageProps, err }) => {
  useEffect(() => {
    initSentry()
  }, [])

  return (
    <ConfigProvider>
      <IntlProvider>
        <Component {...pageProps} err={err} />
      </IntlProvider>
    </ConfigProvider>
  )
}

export default MyApp
