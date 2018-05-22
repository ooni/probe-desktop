import React from 'react'
import Raven from 'raven-js'

const { getSentryConfig } = require('../../main/utils/config')

const sentryConfig = getSentryConfig()

const withSentry = (Child) => {
  return class WrappedComponent extends React.Component {
    static getInitialProps (context) {
      if (Child.getInitialProps) {
        return Child.getInitialProps(context)
      }
      return {}
    }
    constructor (props) {
      super(props)
      this.state = {
        error: null
      }
      Raven.config(sentryConfig.dsn, sentryConfig).install()
    }

    componentDidCatch (error, errorInfo) {
      this.setState({ error })
      Raven.captureException(error, { extra: errorInfo })
    }

    render () {
      return <Child {...this.props} error={this.state.error} />
    }
  }
}

export default withSentry
