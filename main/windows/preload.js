const { contextBridge } = require('electron')
const api = require('./api')

contextBridge.exposeInMainWorld('electron', api)

