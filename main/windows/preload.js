const { ipcRenderer, contextBridge } = require('electron')

contextBridge.exposeInMainWorld('electron', {
  ooni: (fn) => {
    const subscription = (_, args) => fn(args)
    ipcRenderer.on('ooni', subscription)
    return () => {
      ipcRenderer.removeListener('ooni', subscription)
    }
  },
  config: {
    get: (data) => ipcRenderer.invoke('config.get', data),
    getFreshConfig: () => ipcRenderer.invoke('get-fresh-config'),
    set: (key, currentValue, value) => ipcRenderer.invoke('config.set', key, currentValue, value),
    onboard: (crashReportsOptIn) => ipcRenderer.invoke('config.onboard', { crashReportsOptIn }),
    categories: () => ipcRenderer.sendSync('config.categories')
  },
  ooniprobe: {
    run: (testGroupToRun, inputFile) => ipcRenderer.send('ooniprobe.run', { testGroupToRun, inputFile }),
    stop: () => ipcRenderer.send('ooniprobe.stop'),
    runningTest: (fn) => {
      const subscription = (_, args) => fn(args)
      ipcRenderer.on('ooniprobe.running-test', subscription)
      return () => {
        ipcRenderer.removeAllListeners('ooniprobe.running-test', subscription)
      }
    },
    done: (fn) => {
      const subscription = (_, args) => fn(args)
      ipcRenderer.on('ooniprobe.done', subscription)
      return () => {
        ipcRenderer.removeAllListeners('ooniprobe.done', subscription)
      }
    },
    completed: (fn) => ipcRenderer.on('ooniprobe.completed', () => fn()),
    error: (fn) => {
      const subscription = (_, args) => fn(args)
      ipcRenderer.on('ooniprobe.error', subscription)
      return () => {
        ipcRenderer.removeAllListeners('ooniprobe.error', subscription)
      }
    },
  },
  autorun: {
    schedule: () => ipcRenderer.invoke('autorun.schedule'),
    remindLater: () => ipcRenderer.send('autorun.remind-later'),
    maybeRemind: () => ipcRenderer.send('autorun.maybe-remind'),
    cancel: () => ipcRenderer.send('autorun.cancel'),
    showPrompt: (fn) => {
      const subscription = () => fn()
      ipcRenderer.on('autorun.showPrompt', subscription)
      return () => {
        ipcRenderer.removeAllListeners('autorun.showPrompt', subscription)
      }
    },
    removeShowPromptListeners: () => ipcRenderer.removeAllListeners('autorun.showPrompt'),
    status: () => ipcRenderer.invoke('autorun.status'),
    disable: () => ipcRenderer.invoke('autorun.disable')
  },
  about: {
    reset: () => ipcRenderer.invoke('reset'),
    debugGetAllPaths: () => ipcRenderer.sendSync('debugGetAllPaths'),
    updateMessage: (fn) => {
      const subscription = (_, args) => fn(args)
      ipcRenderer.on('update-message', subscription)
      return () => {
        ipcRenderer.removeAllListeners('update-message', subscription)
      }
    },
    updateProgress: (fn) => {
      const subscription = (_, args) => fn(args)
      ipcRenderer.on('update-progress', subscription)
      return () => {
        ipcRenderer.removeAllListeners('update-progress', subscription)
      }
    }
  },
  results: {
    list: (resultID) => ipcRenderer.invoke('list-results', resultID),
    showMeasurement: (msmtID) => ipcRenderer.invoke('show-measurement', msmtID),
    last: {
      request: (testGroupName) => ipcRenderer.send('results.last.request', { testGroupName }),
      response: (fn) => {
        const subscription = (_, args) => fn(args)
        ipcRenderer.on('results.last.response', subscription)
        return () => {
          ipcRenderer.removeAllListeners('results.last.response', subscription)
        }
      },
    },
  },
  prefs: {
    get: (key) => ipcRenderer.sendSync('prefs.get', key),
    save: (key, value) => ipcRenderer.sendSync('prefs.save', { key, value })
  },
  fs: {
    write: {
      request: (testListString) => ipcRenderer.send('fs.write.request', testListString),
      response: (fn) => {
        const subscription = (_, args) => fn(args)
        ipcRenderer.on('fs.write.response', subscription)
        return () => {
          ipcRenderer.removeAllListeners('fs.write.response', subscription)
        }
      },
    }
  }
})
