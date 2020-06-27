import {ipcRenderer} from "electron"
import {Hotkey} from "./hotkey-menu-launcher"


function gatherHotkeys() {
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

            // Build input
            const inputTd = document.createElement("td")
            const input = document.createElement("input")
            inputTd.appendChild(input)
            tr.appendChild(inputTd)

            // Setup inputfield logic
            setupInputField(input)

            tbody.appendChild(tr)
        })

        // Build table
        table.appendChild(tbody)
        body.appendChild(table)
    })
}


function setupInputField(input : HTMLInputElement) {
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







gatherHotkeys()
