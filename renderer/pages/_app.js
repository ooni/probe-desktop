import React from 'react'
import App from 'next/app'
import Router from 'next/router'
import * as Sentry from '@sentry/node'
import { createInstance } from '@datapunt/matomo-tracker-react'

Sentry.init({
  dsn: 'https://e1eef2aaa6054d94bffc4a648fb78f09@sentry.io/1210892',
})

class MyApp extends App {
  componentDidMount() {
    Router.events.on('routeChangeStart', url => {
      const instance = createInstance({
        urlBase: 'https://matomo.ooni.org/',
        siteId: 3, // optional, default value: `1`
        trackerUrl: 'https://matomo.ooni.org/matomo.php',
        srcUrl: 'https://matomo.ooni.org/matomo.js',
      })
      instance.trackPageView({
        href: url
      })
    })
  }

  render() {
    const { Component, pageProps } = this.props

    // Workaround for https://github.com/zeit/next.js/issues/8592
    const { err } = this.props
    const modifiedPageProps = { ...pageProps, err }

    return <Component {...modifiedPageProps} />
  }
}

export default MyApp
