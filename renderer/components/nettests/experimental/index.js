import React from 'react'
import { theme } from 'ooni-components'
import { FormattedMessage } from 'react-intl'
import { NettestGroupCircumvention } from 'ooni-components/dist/icons'
import animation from './anim_experimental.json'

import FormattedMarkdownMessage from '../../FormattedMarkdownMessage'

const color = theme.colors.gray7
const name = <FormattedMessage id="Test.Experimental.Fullname" />
const description = <FormattedMarkdownMessage id="Dashboard.Experimental.Card.Description" />
const longDescription = <div>
  <FormattedMarkdownMessage
    id={'Dashboard.Experimental.Overview.Paragraph'}
    values={{
      experimental_test_list: '<b>stun reachability<b>'
    }}
  />
</div>

const icon = <NettestGroupCircumvention />

export default {
  color,
  name,
  icon,
  description,
  longDescription,
  animation,
  estimatedSize: 'N/A',
  estimatedTimeInSec: () => 30
}
