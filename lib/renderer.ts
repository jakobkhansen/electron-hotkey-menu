import {ipcRenderer, remote} from "electron"
import {Hotkey} from "./hotkey-menu-launcher"

const modifiers = [16, 17, 18, 91, 225]
const specialKeys : Record<number, string> = {
    32:"Space"
}

function initMenu() {
    console.log("Gathering hotkeys...")
    ipcRenderer.send("variable-request", ["hotkeys"])


    ipcRenderer.on("variable-reply", (event, args) => {

        // Get hotkeys
        const hotkeys : Hotkey[] = JSON.parse(args)

        // Create table
        const body = document.getElementsByTagName('body')[0];
        const table = document.createElement("table")
        const tbody = document.createElement("tbody")

        // Build hotkey field
        hotkeys.forEach(f => {

            const tr = document.createElement("tr")

            // Build label
            const label = document.createElement("td")
            label.innerHTML = f.label
            tr.appendChild(label)

            // Build clear button

            // Build input
            const inputTd = document.createElement("td")
            const input = document.createElement("input")
            const button = document.createElement("button")
            inputTd.width = "40%"
            button.innerHTML = "Clear"
            inputTd.appendChild(input)
            inputTd.appendChild(button)
            tr.appendChild(inputTd)

            // Setup inputfield logic
            initInputField(f, input, button)

            tbody.appendChild(tr)
        })


        // Build table
        table.appendChild(tbody)
        body.prepend(table)
    })

    initButtons()
}


function initInputField(hotkey : Hotkey, input : HTMLInputElement, clear : HTMLButtonElement) {
    input.readOnly = true

    const onPressFunc = (event : KeyboardEvent) => {
        onKeyPress(hotkey, input, event)
    }

    input.onfocus = () => {
        document.addEventListener("keydown", onPressFunc);
    }

    input.onblur = () => {
        document.removeEventListener("keydown", onPressFunc)
    }

    clear.onclick = () => {
        hotkey.shortcut = ""
        input.value = ""
    }
}

function onKeyPress(hotkey : Hotkey, input : HTMLInputElement, event : KeyboardEvent) {

    // Ignore only modifier keypresses
    if (modifiers.includes(event.keyCode)) {
        return
    }

    console.log(event.keyCode)

    hotkey.shortcut = ""

    if (event.metaKey) {
        hotkey.shortcut += "Meta+"
    }

    if (event.ctrlKey) {
        hotkey.shortcut += "CmdOrCtrl+"
    }

    if (event.altKey) {
        hotkey.shortcut += "Alt+"
    }

    if (event.keyCode in specialKeys) {
        hotkey.shortcut += specialKeys[event.keyCode]
    } else {
        hotkey.shortcut += event.key
    }

    console.log(hotkey.shortcut.toString())
    input.value = hotkey.shortcut.toString()
}

function initButtons() {
    const cancel = document.getElementById("cancel")
    cancel.onclick = () => {
        console.log("Clicked cancel")
        remote.getCurrentWindow().close()
    }
}

function loadCSS(filename : string) {
        const head = document.getElementsByTagName('HEAD')[0]
        // Create new link Element
        const link = document.createElement('link')

        // set the attributes for link element
        link.rel = 'filename'
        link.type = 'text/css'
        link.href = 'style.css'
        // Append link element to HTML head
        head.appendChild(link)
}







initMenu()
