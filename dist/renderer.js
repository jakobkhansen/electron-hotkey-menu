"use strict";
exports.__esModule = true;
var electron_1 = require("electron");
var fs = require("fs");
var modifiers = [16, 17, 18, 91, 225];
var specialKeys = {
    32: "Space"
};
function initMenu() {
    // Get hotkeys
    var hotkeys = JSON.parse(fs.readFileSync("hotkeys.json").toString());
    // Create table
    var body = document.getElementsByTagName('body')[0];
    var table = document.createElement("table");
    var tbody = document.createElement("tbody");
    // Build hotkey field
    hotkeys.forEach(function (f) {
        var tr = document.createElement("tr");
        // Build label
        var label = document.createElement("td");
        label.innerHTML = f.label;
        tr.appendChild(label);
        // Build clear button
        // Build input
        var inputTd = document.createElement("td");
        var input = document.createElement("input");
        var buttonTd = document.createElement("td");
        var button = document.createElement("button");
        inputTd.width = "40%";
        button.innerHTML = "Clear";
        inputTd.appendChild(input);
        buttonTd.appendChild(button);
        tr.appendChild(buttonTd);
        tr.appendChild(inputTd);
        // Setup inputfield logic
        initInputField(f, input, button);
        tbody.appendChild(tr);
    });
    // Build table
    table.appendChild(tbody);
    body.prepend(table);
    initButtons(hotkeys);
}
function initInputField(hotkey, input, clear) {
    input.readOnly = true;
    input.value = hotkey.shortcut.toString();
    var onPressFunc = function (event) {
        onKeyPress(hotkey, input, event);
    };
    input.onfocus = function () {
        document.addEventListener("keydown", onPressFunc);
    };
    input.onblur = function () {
        document.removeEventListener("keydown", onPressFunc);
    };
    clear.onclick = function () {
        hotkey.shortcut = "";
        input.value = "";
    };
}
function onKeyPress(hotkey, input, event) {
    // Ignore only modifier keypresses
    if (modifiers.includes(event.keyCode)) {
        return;
    }
    console.log(event.keyCode);
    hotkey.shortcut = "";
    if (event.metaKey) {
        hotkey.shortcut += "Super+";
    }
    if (event.ctrlKey) {
        hotkey.shortcut += "CmdOrCtrl+";
    }
    if (event.altKey) {
        hotkey.shortcut += "Alt+";
    }
    if (event.shiftKey) {
        hotkey.shortcut += "Shift+";
    }
    if (event.keyCode in specialKeys) {
        hotkey.shortcut += specialKeys[event.keyCode];
    }
    else {
        hotkey.shortcut += event.key;
    }
    console.log(hotkey.shortcut.toString());
    input.value = hotkey.shortcut.toString();
}
function initButtons(hotkeys) {
    var cancel = document.getElementById("cancel");
    var confirm = document.getElementById("confirm");
    cancel.onclick = function () {
        console.log("Clicked cancel");
        electron_1.remote.getCurrentWindow().close();
    };
    confirm.onclick = function () {
        fs.writeFileSync("hotkeys.json", JSON.stringify(hotkeys));
        electron_1.remote.getCurrentWindow().close();
    };
}
function loadCSS(filename) {
    var head = document.getElementsByTagName('HEAD')[0];
    // Create new link Element
    var link = document.createElement('link');
    // set the attributes for link element
    link.rel = 'filename';
    link.type = 'text/css';
    link.href = 'style.css';
    // Append link element to HTML head
    head.appendChild(link);
}
initMenu();
//# sourceMappingURL=renderer.js.map