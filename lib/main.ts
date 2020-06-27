import {app, BrowserWindow, remote} from "electron"
import {HotkeyMenu, Hotkey} from "./hotkey-menu-launcher"

app.on("ready", () => {
    const hotkeys = new HotkeyMenu()

    hotkeys.addHotkey(new Hotkey(() => {
        console.log("Hotkey 2 pressed")
    }, "Test hotkey", "CommandOrControl+S"))

    hotkeys.addHotkey(new Hotkey(() => {
        console.log("Hotkey 2 pressed")
    }, "Hotkey 2"))

    hotkeys.registerHotkeysGlobal()

    hotkeys.displayMenu()
})
