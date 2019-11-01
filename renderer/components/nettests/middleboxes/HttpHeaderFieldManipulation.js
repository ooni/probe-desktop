import React from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
import { Flex, Box } from 'ooni-components'

import FormattedMarkdownMessage from '../../FormattedMarkdownMessage'

const HttpHeaderFieldManipulation = ({isAnomaly, render}) => {

  const HHFMDetails = () => (
    <Box>
      <Flex my={3} flexDirection='column'>
        {isAnomaly ? (
          <Box>
            <FormattedMarkdownMessage
              id='TestResults.Details.Middleboxes.HTTPHeaderFieldManipulation.Found.Content.Paragraph'
            />
          </Box>
        ): (
          <Box>
            <FormattedMessage
              id='TestResults.Details.Middleboxes.HTTPHeaderFieldManipulation.NotFound.Content.Paragraph'
            />
          </Box>
        )}
      </Flex>
    </Box>
  )

  const heroTitle = isAnomaly ? (
    <FormattedMessage id='TestResults.Details.Middleboxes.HTTPHeaderFieldManipulation.Found.Hero.Title' />
  ) : (
    <FormattedMessage id='TestResults.Details.Middleboxes.HTTPHeaderFieldManipulation.NotFound.Hero.Title' />
  )

  return (
    <div>
      {render({
        heroTitle: heroTitle,
        details: <HHFMDetails />
      })}
    </div>
  )
}

HttpHeaderFieldManipulation.propTypes = {
  measurement: PropTypes.object,
  isAnomaly: PropTypes.bool,
  render: PropTypes.func
}

export { HttpHeaderFieldManipulation }

export default {
  name: <FormattedMessage id='Test.HTTPHeaderFieldManipulation.Fullname' />,
  methodology: 'https://ooni.org/nettest/http-header-field-manipulation/'
}
