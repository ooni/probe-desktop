import React from 'react'

import {
  theme,
} from 'ooni-components'

import { FormattedMessage } from 'react-intl'

import FormattedMarkdownMessage from '../../FormattedMarkdownMessage'

import { default as animation } from 'ooni-components/animations/RunningMiddleBoxes.json'

import { NettestGroupMiddleBoxes } from 'ooni-components/icons'

const color = theme.colors.violet8
const name = <FormattedMessage id="Test.Middleboxes.Fullname" />
const description = <FormattedMarkdownMessage id="Dashboard.Middleboxes.Card.Description" />
const longDescription = <div>
  <FormattedMarkdownMessage id={'Dashboard.Middleboxes.Overview.Paragraph'} />
</div>

const icon = <NettestGroupMiddleBoxes />

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
