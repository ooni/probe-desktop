import React, { useEffect } from 'react'
import { useMatomo } from '@datapunt/matomo-tracker-react'
import electron from 'electron'

const MatomoTracker = () => {
  const instance = useMatomo()
  useEffect(async () => {
    const remote = electron.remote
    const { getConfig } = remote.require('./utils/config')

    instance && instance.trackPageView()
  }, [])
  return <React.Fragment />
}

export default MatomoTracker
