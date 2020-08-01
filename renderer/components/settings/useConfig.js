import React, { useState, useContext, useEffect, useCallback } from 'react'
import electron from 'electron'

export const ConfigContext = React.createContext([{}, () => {}])

export const ConfigProvider = (props) => {
  const [state, setState] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadConfigFromFile =  async () => {
      const remote = electron.remote
      const { getConfig } = remote.require('./utils/config')
      const config = await getConfig()
      setState(config)
      setLoading(false)
    }
    loadConfigFromFile()
  }, [])

  if (loading) {
    return <div />
  }

  return (
    <ConfigContext.Provider value={[state, setState]}>
      {props.children}
    </ConfigContext.Provider>
  )
}

export const getConfigValue = (config, optionKey) => optionKey.split('.').reduce((o,i) => o[i], config)

export const useConfig = (key) => {
  const [config, setConfigContext] = useContext(ConfigContext)
  const currentValue = getConfigValue(config, key)

  const [err, setErr] = useState(null)
  const [pending, setPending] = useState(false)

  const setConfigValue = useCallback((value) => {
    setPending(true)
    const remote = electron.remote
    const { setConfig } = remote.require('./utils/config')

    setConfig(key, currentValue, value)
      .then((result) => {
        setConfigContext(result)
      })
      .catch(setErr)
      .finally(() => setPending(false))
  }, [key, setConfigContext, currentValue])

  return [
    currentValue,
    setConfigValue,
    pending,
    err,
  ]
}

export const useGetConfig = (key) => {
  const [config] = useContext(ConfigContext)
  return getConfigValue(config, key)
}
