import {remote, ipcMain} from "electron"
import {HotkeyMenu, Hotkey} from "electron-hotkey-menu"

let hotkeys : HotkeyMenu

function initHotkeyMenu() {
    hotkeys = new HotkeyMenu({
        width:400,
        height:400
    })


    hotkeys.addHotkey(new Hotkey("Hotkey 1", undefined, () => {
        console.log("First")
    }))

    hotkeys.addHotkey(new Hotkey("Hotkey 2", undefined, () => {
        console.log("Second")
    }))

    hotkeys.registerHotkeysGlobal()

    console.log(hotkeys.hotkeys)

    document.getElementById("hotkeys").onclick = () => hotkeys.displayMenu()
}

console.log("Script loaded")
initHotkeyMenu()
