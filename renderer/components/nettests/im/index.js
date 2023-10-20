import React from 'react'

import {
  theme,
} from 'ooni-components'

import { FormattedMessage } from 'react-intl'

import FormattedMarkdownMessage from '../../FormattedMarkdownMessage'

import animation from 'ooni-components/animations/RunningInstantMessaging.json'
import { NettestGroupInstantMessaging } from 'ooni-components/icons'

const color = theme.colors.cyan6
const name = <FormattedMessage id="Test.InstantMessaging.Fullname" />
const description = <FormattedMarkdownMessage id="Dashboard.InstantMessaging.Card.Description" />
const longDescription = <div>
  <FormattedMarkdownMessage id={'Dashboard.InstantMessaging.Overview.Paragraph'} />
</div>

const icon = <NettestGroupInstantMessaging />

export default {
  color,
  name,
  icon,
  description,
  longDescription,
  animation,
  estimatedSize: '< 1 MB',
  estimatedTimeInSec: () => 30
}
