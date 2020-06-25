import { BrowserWindow, globalShortcut, ipcMain } from "electron"

export class HotkeyMenu {

    hotkeys : Hotkey[] = []

    addHotkey(hotkey : Hotkey) {
        this.hotkeys.push(hotkey)
    }

     registerHotkeysGlobal() {
        this.hotkeys.forEach(key => {
            globalShortcut.register(key.shortcut, key.onPress)
        })
    }

    displayMenu() {
        const win = new BrowserWindow({
            width: 600,
            height: 900,
            autoHideMenuBar:true,
            webPreferences: {
                nodeIntegration:true,
            }
        })

        win.loadFile("../lib/menu.html")
        win.webContents.openDevTools()

        console.log(JSON.stringify(this.hotkeys))

        ipcMain.on('variable-request', (event,arg) => {
            event.sender.send('variable-reply', JSON.stringify(this.hotkeys));
        });
    }
}

export class Hotkey {
    label : string
    shortcut : Electron.Accelerator
    onPress : () => any

    constructor(onPress : () => any, label : string, key : Electron.Accelerator = "")  {
        this.onPress = onPress
        this.label = label
        this.shortcut = key
    }
}
