import React from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
import { Flex, Box } from 'ooni-components'

import FormattedMarkdownMessage from '../../FormattedMarkdownMessage'

const HttpInvalidRequestLine = ({isAnomaly, render}) => {

  const HIRLDetails = () => (
    <Box>
      <Flex my={3} flexDirection='column'>
        {isAnomaly ? (
          <Box>
            <FormattedMarkdownMessage
              id='TestResults.Details.Middleboxes.HTTPInvalidRequestLine.Found.Content.Paragraph'
            />
          </Box>
        ): (
          <Box>
            <FormattedMessage
              id='TestResults.Details.Middleboxes.HTTPInvalidRequestLine.NotFound.Content.Paragraph'
            />
          </Box>
        )}
      </Flex>
    </Box>
  )

  const heroTitle = isAnomaly ? (
    <FormattedMessage id='TestResults.Details.Middleboxes.HTTPInvalidRequestLine.Found.Hero.Title' />
  ) : (
    <FormattedMessage id='TestResults.Details.Middleboxes.HTTPInvalidRequestLine.NotFound.Hero.Title' />
  )

  return (
    <div>
      {render({
        heroTitle: heroTitle,
        details: <HIRLDetails />
      })}
    </div>
  )
}

HttpInvalidRequestLine.propTypes = {
  measurement: PropTypes.object,
  isAnomaly: PropTypes.bool,
  render: PropTypes.func
}

export { HttpInvalidRequestLine }

export default {
  name: <FormattedMessage id='Test.HTTPInvalidRequestLine.Fullname' />
}
