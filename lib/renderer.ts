import {ipcRenderer} from "electron"
import {Hotkey} from "./hotkey-menu-launcher"


function gatherHotkeys() {
    console.log("Gathering hotkeys...")
    ipcRenderer.send("variable-request", ["hotkeys"])

    ipcRenderer.on("variable-reply", (event, args) => {
        console.log(args)
        let hotkeys : Hotkey[] = JSON.parse(args)
        console.log(hotkeys)
    })
}

gatherHotkeys()
