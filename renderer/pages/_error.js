import React from 'react'
import Raven from 'raven-js'
import { getSentryConfig } from '../../main/utils/sentry'

export default class Error extends React.Component {
  static getInitialProps({ res, err }) {
    Raven.config(getSentryConfig()).install()
    Raven.captureException(err)
    const statusCode = res ? res.statusCode : err ? err.statusCode : null;
    return { statusCode, err }
  }

  render() {
    return <div>
      <p>
        {this.props.statusCode
          ? `An error ${this.props.statusCode} occurred on server`
          : 'An error occurred on client'}
      </p>
      <p>
      Error: {this.props.err && this.props.err.toString()}
      </p>
    </div>
  }
}
