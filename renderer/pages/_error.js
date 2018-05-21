import React from 'react'

export default class Error extends React.Component {
  static getInitialProps({ res, err }) {
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
      {this.props.err && this.props.err.toString()}
      </p>
    </div>
  }
}
