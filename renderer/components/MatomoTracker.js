import React, { useEffect } from 'react'
import { useMatomo } from '@datapunt/matomo-tracker-react'
import electron from 'electron'

import { getConfigValue } from './utils'

const MatomoTracker = () => {

  const instance = useMatomo()

  useEffect(() => {
    const checkConfigAndTrackUsage =  async () => {
      const remote = electron.remote
      const { getConfig } = remote.require('./utils/config')
      const config = await getConfig()
      const collectAnalytics =  getConfigValue(config, 'advanced.collect_usage_stats')
      collectAnalytics && instance && instance.trackPageView()
    }

    checkConfigAndTrackUsage()
  }, [])
  return <React.Fragment />
}

export default MatomoTracker
