import React from 'react'
import {
  Text
} from 'ooni-components'

const ErrorView = ({error}) => {
  return <div>
    <Text>{error.toString()}</Text>
  </div>
}

export default ErrorView
