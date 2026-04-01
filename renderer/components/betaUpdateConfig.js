// How long to wait after dashboard renders before showing the prompt (ms)
export const PROMPT_DELAY = 5 * 1000

// How long to suppress the prompt after "Remind me later" (ms)
// Default: 24 hours. Change this value to adjust the interval.
export const REMIND_LATER_INTERVAL = 24 * 60 * 60 * 1000

const STORAGE_KEY = 'betaUpdate.remindLaterTimestamp'

export const DOWNLOAD_URL = 'https://github.com/ooni/probe-multiplatform/releases/latest'

export const setRemindLater = () => {
  localStorage.setItem(STORAGE_KEY, Date.now().toString())
}

export const shouldShowPrompt = () => {
  const timestamp = localStorage.getItem(STORAGE_KEY)
  if (!timestamp) return true
  return Date.now() - Number(timestamp) >= REMIND_LATER_INTERVAL
}
