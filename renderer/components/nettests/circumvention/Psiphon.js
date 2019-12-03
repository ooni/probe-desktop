import React from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'

const Psiphon = ({measurement, isAnomaly, render}) => {
  const testKeys = JSON.parse(measurement.test_keys)
  return (
    <div>
      {render({
        heroTitle: isAnomaly ? 'Blocked' : 'Not Blocked',
        details: <pre>{JSON.stringify(testKeys, null, 2)}</pre>
      })}
    </div>
  )
}

Psiphon.propTypes = {
  measurement: PropTypes.object,
  isAnomaly: PropTypes.bool,
  render: PropTypes.func
}

export { Psiphon }

// Metadata for the nettest
export default {
  name: <FormattedMessage id='Test.Psiphon.Fullname' />,
  methodology: 'https://ooni.org/nettest/psiphon/'
}
