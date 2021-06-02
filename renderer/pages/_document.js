import React from 'react'
import Document, { Html, Head, Main, NextScript } from 'next/document'
import { ServerStyleSheet } from 'styled-components'

import '../components/globalStyle'

class CustomDocument extends Document {
  static getInitialProps ({ renderPage }) {
    const sheet = new ServerStyleSheet()
    const page = renderPage(App => props =>
      sheet.collectStyles(
        <App {...props} />
      )
    )
    const styleTags = sheet.getStyleElement()
    const props = { ...page, styleTags }
    return props
  }

  render () {
    return (
      <Html>
        <Head>
          {this.props.styleTags}
        </Head>
        <body>
          <div className='root'>
            <Main />
          </div>
          <script src='/static/translations.js' />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default CustomDocument
