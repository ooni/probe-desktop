import React from 'react'

import Document, { Head, Main, NextScript } from 'next/document'
import { ServerStyleSheet } from 'styled-components'

import '../components/globalStyle'
import withSentry from '../components/withSentry'

const debug = require('debug')('ooniprobe-desktop.renderer.pages._document')

class CustomDocument extends Document {
  static getInitialProps ({ renderPage }) {
    debug('getInitialProps')
    const sheet = new ServerStyleSheet()
    const page = renderPage(App => props => {
      debug('props', props, sheet)
      return sheet.collectStyles(<App {...props} />)
    })
    const styleTags = sheet.getStyleElement()
    const props = { ...page, styleTags }
    return props
  }

  render () {
    return (
      <html>
        <Head>
          <title>OONI Probe</title>
          {this.props.styleTags}
        </Head>
        <body>
          <div className='root'>
            <Main />
          </div>
          <script src='/static/locale-data.js' />
          <script src='/static/translations.js' />
          <NextScript />
        </body>
      </html>
    )
  }
}

export default withSentry(CustomDocument)
