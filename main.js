const { app, BrowserWindow, ipcMain, session } = require('electron')
const path = require('node:path')
const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      // nodeIntegration: true,
      preload: path.join(__dirname, 'preload.js'),
    },
  })

  win.loadFile('dist/index.html')
}

app.whenReady().then(() => {
  session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
    callback({
      responseHeaders: {
        ...details.responseHeaders,
        'Content-Security-Policy': '*', // 允许所有的资源加载
        'Access-Control-Allow-Origin': '*', // 允许跨域
        'Cross-Origin-Embedder-Policy': ['require-corp'], // 允许跨域
        'Cross-Origin-Opener-Policy': ['same-origin'], // 允许跨域
      }
    })
  })
  session.defaultSession.setProxy({
    mode: 'fixed_servers',
    proxyRules: 'http://111.198.15.161:9900'
  })

  createWindow()
  ipcMain.handle('ping', () => 'pong')
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// app.on('window-all-closed', () => {
//   if (process.platform !== 'darwin') {
//     app.quit()
//   }
//   app.quit()
// })
