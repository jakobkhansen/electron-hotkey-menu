import {app, BrowserWindow, remote} from "electron"
import {HotkeyMenu, Hotkey} from "./hotkey-menu-launcher"

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

    win.loadFile("../lib/test.html")
    win.webContents.openDevTools()


    //const hotkeys = new HotkeyMenu()

    //hotkeys.addHotkey(new Hotkey(() => {
        //console.log("Hotkey 2 pressed")
    //}, "Test hotkey", "CommandOrControl+S"))

    //hotkeys.addHotkey(new Hotkey(() => {
        //console.log("Hotkey 2 pressed")
    //}, "Hotkey 2"))

    //hotkeys.displayMenu()
})
