import React from 'react'

import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import { linkTo } from '@storybook/addon-links'

import Running from '../renderer/components/home/running'
import Layout from '../renderer/components/Layout'

storiesOf('Components/home/running', module)
  .add('Default', () =>
    <Layout>
      <Running
        testGroupName='websites'
        progressLine='progress something'
        percent={0.1}
        runningTest='some test name'
        logLines={['line 1', 'line 2']}
      />
    </Layout>
  )
