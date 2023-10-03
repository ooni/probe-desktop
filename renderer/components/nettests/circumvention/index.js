import React from 'react'
import { theme } from 'ooni-components'
import { FormattedMessage } from 'react-intl'
import { NettestGroupCircumvention } from 'ooni-components/icons'
import animation from 'ooni-components/animations/RunningCircumvention.json'

import FormattedMarkdownMessage from '../../FormattedMarkdownMessage'

const color = theme.colors.pink6
const name = <FormattedMessage id="Test.Circumvention.Fullname" />
const description = <FormattedMarkdownMessage id="Dashboard.Circumvention.Card.Description" />
const longDescription = <div>
  <FormattedMarkdownMessage id={'Dashboard.Circumvention.Overview.Paragraph'} />
</div>

const icon = <NettestGroupCircumvention />

export default {
  color,
  name,
  icon,
  description,
  longDescription,
  animation,
  estimatedSize: '< 1 MB',
  estimatedTimeInSec: () => 15
}
