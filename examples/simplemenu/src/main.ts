import {app, BrowserWindow, remote} from "electron"

app.on("ready", () => {
    const win = new BrowserWindow({
        width: 200,
        height: 300,
        autoHideMenuBar:true,
        webPreferences: {
            nodeIntegration:true,
            enableRemoteModule:true
        }
    })

    win.loadFile("../src/test.html")
    win.webContents.openDevTools()
})
