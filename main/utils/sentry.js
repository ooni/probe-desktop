/* global module */
const { init } = require('@sentry/electron')
const isDev = require('electron-is-dev')
const { name } = require('../../package.json')

init({
  enabled: process.env.NODE_ENV === 'production',
  dsn: 'https://e1eef2aaa6054d94bffc4a648fb78f09@o155150.ingest.sentry.io/1210892',
  environment: isDev ? 'development' : 'production',
  debug: isDev,
  appName: name
})
