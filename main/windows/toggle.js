
const toggleWindow = (event, window) => {
  const isVisible = window.isVisible()
  const isWin = process.platform === 'win32'
  const isMain = global.windows && window === global.windows.main

  if (event) {
    // Don't open the menu
    event.preventDefault()
  }

  // If window open and not focused, bring it to focus
  if (!isWin && isVisible && !window.isFocused()) {
    window.focus()
    return
  }

  if (isVisible) {
    window.close()
  } else {
    window.show()
  }
}

module.exports = toggleWindow
