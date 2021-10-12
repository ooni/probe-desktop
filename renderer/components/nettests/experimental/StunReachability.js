import React from 'react'
import PropTypes from 'prop-types'

const StunReachability = ({ render }) => {

  return (
    <div>
      {render({
        // heroTitle: '',
        // heroBG: theme.colors.gray7,
        details: <div />
      })}
    </div>
  )
}

StunReachability.propTypes = {
  measurement: PropTypes.object,
  isAnomaly: PropTypes.bool,
  render: PropTypes.func
}

export { StunReachability }

// Metadata for the nettest
export default {
  name: 'stunreachability',
}
