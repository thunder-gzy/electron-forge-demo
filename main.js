const { app, BrowserWindow, ipcMain, session, globalShortcut } = require('electron')
const path = require('node:path')
const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      preload: path.join(__dirname, 'preload.js'),
      webSecurity: false,
      // contextIsolation: false, // 会导致模型加载不出来，隔离了上下文
    },
  })

  win.loadFile('dist/index.html')
  // win.loadFile('index.html')
  globalShortcut.register('command+option+i', () => {
    win.webContents.openDevTools(
      // {mode: 'detach'}
    )
  })
}

app.whenReady().then(() => {
  session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
    console.log('details', details)
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
  // session.defaultSession.setProxy({
  //   mode: 'fixed_servers',
  //   proxyRules: 'http://111.198.15.161:9900'
  // })

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
