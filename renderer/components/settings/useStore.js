import { useState, useCallback } from 'react'
// import log from 'electron-log'

export const useStore = (key) => {
  const [currentValue, setCurrentValue] = useState(window.electron.prefs.get(key))
  const [error, setError] = useState(null)

  const setValue = useCallback((value) => {
    const result = window.electron.prefs.save(key, value)
    // returns `true` if success, error message on failure
    if (result !== true) {
      setError(result)
      // log.error(result)
    }
    setCurrentValue(value)
  }, [key])

  return [
    currentValue,
    setValue,
    error
  ]
}