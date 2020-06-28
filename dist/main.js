"use strict";
exports.__esModule = true;
var electron_1 = require("electron");
electron_1.app.on("ready", function () {
    var win = new electron_1.BrowserWindow({
        width: 200,
        height: 300,
        autoHideMenuBar: true,
        webPreferences: {
            nodeIntegration: true,
            enableRemoteModule: true
        }
    });
    win.loadFile("../lib/test.html");
    win.webContents.openDevTools();
    //const hotkeys = new HotkeyMenu()
    //hotkeys.addHotkey(new Hotkey(() => {
    //console.log("Hotkey 2 pressed")
    //}, "Test hotkey", "CommandOrControl+S"))
    //hotkeys.addHotkey(new Hotkey(() => {
    //console.log("Hotkey 2 pressed")
    //}, "Hotkey 2"))
    //hotkeys.displayMenu()
});
//# sourceMappingURL=main.js.map