const { app, BrowserWindow } = require('electron')
let window

app.on('ready', () => {
    window = new BrowserWindow({width:1200, height: 800})
    window.loadFile('index.html')
    window.webContents.openDevTools()
    window.on('closed',() => {
        window = null
    })
})
app.on('window-all-closed',() => {
    if (process.platform !== 'darwin'){
        app.quit()
    }
})