import { ipcRenderer, ipcMain, remote } from "electron"
import * as fs from "fs"
import * as path from "path"
import { Hotkey } from "./hotkey-menu-launcher"
import * as pkgDir from "pkg-dir"

const modifiers = [16, 17, 18, 91, 225]
const specialKeys: Record<number, string> = {
	32: "Space",
}

let hotkeys : Hotkey[]
let hotkeyFilePath : string

function initMenu() {
    gatherHotkeyPathFromMain().then((result : string) => {
        hotkeyFilePath = result
        hotkeys = JSON.parse(fs.readFileSync(hotkeyFilePath).toString())

        document.getElementsByTagName("body")[0].prepend(buildHotkeyTable())

        initButtons()
        loadCustomCSSIfExists()
    })
}

function gatherHotkeyPathFromMain() {
	return new Promise((resolve) => {
		ipcRenderer.send("hotkey-file-request", ["hotkeys"])

		ipcRenderer.on("hotkey-file-reply", (event, args) => {
			resolve(args)
		})
	})
}

function buildHotkeyTable() : HTMLTableElement {
	// Create table
	const table : HTMLTableElement = document.createElement("table")
	const tbody = document.createElement("tbody")

	// Build table row for each hotkey
	hotkeys.forEach((hotkey) => {
        const tr = buildTableRow(hotkey)
		tbody.appendChild(tr)
        initInputField(hotkey, tr)
	})

    table.appendChild(tbody)

    return table
}

function buildTableRow(hotkey : Hotkey) : HTMLTableRowElement {
		const tr = document.createElement("tr")

		// Build label
		const label = document.createElement("td")
		label.innerHTML = hotkey.label
		tr.appendChild(label)


		// Build input
		const inputTd = document.createElement("td")
		const input = document.createElement("input")

		const buttonTd = document.createElement("td")
		const button = document.createElement("button")

		inputTd.width = "40%"
		button.innerHTML = "Clear"
		inputTd.appendChild(input)
		buttonTd.appendChild(button)
		tr.appendChild(buttonTd)
		tr.appendChild(inputTd)

        return tr
}

function initInputField(hotkey: Hotkey, row : HTMLTableRowElement) {
    const input = row.getElementsByTagName("input")[0]
    const clear = row.getElementsByTagName("button")[0]

	input.readOnly = true
	input.value = hotkey.shortcut.toString()

	const onPressFunc = (event: KeyboardEvent) => {
		onKeyPress(hotkey, input, event)
	}

	input.onfocus = () => {
		document.addEventListener("keydown", onPressFunc)
	}

	input.onblur = () => {
		document.removeEventListener("keydown", onPressFunc)
	}

	clear.onclick = () => {
		hotkey.shortcut = ""
		input.value = ""
	}
}

function onKeyPress(
	hotkey: Hotkey,
	input: HTMLInputElement,
	event: KeyboardEvent
) {
	// Ignore only modifier keypresses
	if (modifiers.includes(event.keyCode)) {
		return
	}

	hotkey.shortcut = ""

	if (event.metaKey) {
		hotkey.shortcut += "Super+"
	}

	if (event.ctrlKey) {
		hotkey.shortcut += "CmdOrCtrl+"
	}

	if (event.altKey) {
		hotkey.shortcut += "Alt+"
	}

	if (event.shiftKey) {
		hotkey.shortcut += "Shift+"
	}

	if (event.keyCode in specialKeys) {
		hotkey.shortcut += specialKeys[event.keyCode]
	} else {
		hotkey.shortcut += event.key
	}

	input.value = hotkey.shortcut.toString()
}

function initButtons() {
	const cancel = document.getElementById("cancel")
	const confirm = document.getElementById("confirm")

	cancel.onclick = () => {
		remote.getCurrentWindow().close()
	}

	confirm.onclick = () => {
		fs.writeFileSync(hotkeyFilePath, JSON.stringify(hotkeys))
		remote.getCurrentWindow().close()
	}
}

function loadCustomCSSIfExists() {
	const cssFilename = gatherCSSPathFromMain()

	cssFilename.then((result) => {
		// If css path is not undefined, load it
		if (result) {
			loadCSSIntoWindow(result)
		}
	})
}

// Get CSS from Main via ipc
function gatherCSSPathFromMain(): Promise<string> {
	return new Promise((resolve) => {
		ipcRenderer.send("css-request", ["hotkeys"])

		ipcRenderer.on("css-reply", (event, args) => {
			resolve(args)
		})
	})
}

// Load CSS into the menu. Filepath is relative to node project.
function loadCSSIntoWindow(relativePath: string) {
	const absolutePath = path.join(pkgDir.sync(), relativePath)

	const head = document.getElementsByTagName("HEAD")[0]
	// Create new link Element
	const link = document.createElement("link")

	// set the attributes for link element
	link.rel = "stylesheet"
	link.type = "text/css"
	link.href = absolutePath
	// Append link element to HTML head
	head.appendChild(link)
}

initMenu()
