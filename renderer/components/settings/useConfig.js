import PropTypes from 'prop-types'
import React, { useState, useContext, useEffect, useCallback } from 'react'

export const ConfigContext = React.createContext([{}, () => {}])

export const ConfigProvider = (props) => {
  const [state, setState] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadConfigFromFile =  async () => {
      const config = await window.electron.config.get()
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

ConfigProvider.propTypes = {
  children: PropTypes.node
}

export const getConfigValue = (config, optionKey) => optionKey.split('.').reduce((o,i) => o[i], config)

export const useConfig = (key = null) => {
  const [config, setConfigContext] = useContext(ConfigContext)
  if (config === null) {
    window.electron.config.getFreshConfig().then((config) => {
      setConfigContext(config)
    })
  }
  const currentValue = config !== null
    ? key === null
      ? config
      : getConfigValue(config, key)
    : undefined

  const [err, setErr] = useState(null)
  const [pending, setPending] = useState(false)

  const setConfigValue = useCallback((value) => {
    setPending(true)
    window.electron.config.set(key, currentValue, value)
      .then((result) => {
        setConfigContext(result)
      })
      .catch(setErr)
      .finally(() => setPending(false))
  }, [setConfigContext, currentValue, key])

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
