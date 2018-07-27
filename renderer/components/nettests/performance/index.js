import React from 'react'

import {
  theme,
} from 'ooni-components'

import { FormattedMessage } from 'react-intl'

import FormattedMarkdownMessage from '../../FormattedMarkdownMessage'

import { NettestGroupPerformance } from 'ooni-components/dist/icons'

const color = theme.colors.fuschia6
const name = <FormattedMessage id="Test.Performance.Fullname" />
const description = <FormattedMarkdownMessage id="Dashboard.Performance.Card.Description" />
const longDescription = <div>
  <FormattedMarkdownMessage id={'Dashboard.Performance.Overview.Paragraph.1'} />
  <FormattedMarkdownMessage id={'Dashboard.Performance.Overview.Paragraph.2'} />
</div>

const icon = <NettestGroupPerformance />

export default {
  color,
  name,
  icon,
  description,
  longDescription
}
