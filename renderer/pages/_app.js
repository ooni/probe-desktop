import React from 'react'
import App from 'next/app'
import * as Sentry from '@sentry/electron'

Sentry.init({
  // Replace with your project's Sentry DSN
  dsn: 'https://e1eef2aaa6054d94bffc4a648fb78f09@sentry.io/1210892',
})

class MyApp extends App {
  render() {
    const { Component, pageProps } = this.props

    // Workaround for https://github.com/zeit/next.js/issues/8592
    const { err } = this.props
    const modifiedPageProps = { ...pageProps, err }

    return <Component {...modifiedPageProps} />
  }
}

export default MyApp
