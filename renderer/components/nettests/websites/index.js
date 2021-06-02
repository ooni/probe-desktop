import React from 'react'

import {
  theme,
} from 'ooni-components'

import { default as animation } from 'ooni-components/components/animations/RunningWebsites.json'

import { FormattedMessage } from 'react-intl'

import FormattedMarkdownMessage from '../../FormattedMarkdownMessage'

import { NettestGroupWebsites } from 'ooni-components/dist/icons'

const color = theme.colors.indigo6
const name = <FormattedMessage id="Test.Websites.Fullname" />
const description = <FormattedMarkdownMessage id="Dashboard.Websites.Card.Description" />
const longDescription = <div>
  <FormattedMarkdownMessage id={'Dashboard.Websites.Overview.Paragraph.Desktop'} />
</div>

const icon = <NettestGroupWebsites />

export default {
  color,
  name,
  icon,
  description,
  longDescription,
  animation,
  estimatedSize: '~8 MB',
  estimatedTimeInSec: (maxRuntime) => Number(maxRuntime) !== 0 ? 30 + maxRuntime : 3600
}
