import React from 'react'

import {
  theme,
} from 'ooni-components'

import { FormattedMessage } from 'react-intl'

import FormattedMarkdownMessage from '../../FormattedMarkdownMessage'

import { NettestGroupMiddleBoxes } from 'ooni-components/dist/icons'

const color = theme.colors.violet8
const name = <FormattedMessage id="Test.Middleboxes.Fullname" />
const description = <FormattedMarkdownMessage id="Dashboard.Middleboxes.Card.Description" />
const longDescription = <div>
  <FormattedMarkdownMessage id={'Dashboard.Middleboxes.Overview.Paragraph.1'} />
  <FormattedMarkdownMessage id={'Dashboard.Middleboxes.Overview.Paragraph.2'} />
</div>

const icon = <NettestGroupMiddleBoxes />

export default {
  color,
  name,
  icon,
  description,
  longDescription
}
