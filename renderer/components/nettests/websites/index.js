import React from 'react'

import {
  theme,
} from 'ooni-components'

import { FormattedMessage } from 'react-intl'

import FormattedMarkdownMessage from '../../FormattedMarkdownMessage'

import { NettestGroupWebsites } from 'ooni-components/dist/icons'

const color = theme.colors.indigo5
const name = <FormattedMessage id="Test.Websites.Fullname" />
const description = <FormattedMarkdownMessage id="Dashboard.Websites.Card.Description" />
const longDescription = <div>
  <FormattedMarkdownMessage id={'Dashboard.Websites.Overview.Paragraph.1'} />
  <FormattedMarkdownMessage id={'Dashboard.Websites.Overview.Paragraph.2'} />
</div>

const icon = <NettestGroupWebsites />

export default {
  color,
  name,
  icon,
  description,
  longDescription
}
