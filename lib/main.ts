import {app, BrowserWindow, remote} from "electron"
import {HotkeyMenu, Hotkey} from "./hotkey-menu-launcher"

app.on("ready", () => {
    const hotkeys = new HotkeyMenu()

    hotkeys.addHotkey(new Hotkey(() => {
        console.log("Hotkey pressed")
    }, "Test hotkey", "CommandOrControl+S"))

    hotkeys.registerHotkeysGlobal()

    hotkeys.displayMenu()
})
