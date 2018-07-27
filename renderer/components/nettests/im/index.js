import React from 'react'

import {
  theme,
} from 'ooni-components'

import { FormattedMessage } from 'react-intl'

import FormattedMarkdownMessage from '../../FormattedMarkdownMessage'

import { NettestGroupInstantMessaging } from 'ooni-components/dist/icons'

const color = theme.colors.cyan6
const name = <FormattedMessage id="Test.InstantMessaging.Fullname" />
const description = <FormattedMarkdownMessage id="Dashboard.InstantMessaging.Card.Description" />
const longDescription = <div>
  <FormattedMarkdownMessage id={'Dashboard.InstantMessaging.Overview.Paragraph.1'} />
  <FormattedMarkdownMessage id={'Dashboard.InstantMessaging.Overview.Paragraph.2'} />
</div>

const icon = <NettestGroupInstantMessaging />

export default {
  color,
  name,
  icon,
  description,
  longDescription
}
