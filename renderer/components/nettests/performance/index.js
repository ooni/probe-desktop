import React from 'react'

import {
  theme,
} from 'ooni-components'

import { FormattedMessage } from 'react-intl'

import FormattedMarkdownMessage from '../../FormattedMarkdownMessage'
import { default as animation } from 'ooni-components/components/animations/RunningPerformance.json'

import { NettestGroupPerformance } from 'ooni-components/dist/icons'

const color = theme.colors.fuchsia6
const name = <FormattedMessage id="Test.Performance.Fullname" />
const description = <FormattedMarkdownMessage id="Dashboard.Performance.Card.Description" />
const longDescription = <div>
  <FormattedMarkdownMessage id={'Dashboard.Performance.Overview.Paragraph'} />
</div>

const icon = <NettestGroupPerformance />

export default {
  color,
  name,
  icon,
  description,
  longDescription,
  animation,
  estimatedSize: '5 - 200 MB',
  estimatedTimeInSec: () => 105
}
