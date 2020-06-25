"use strict";
exports.__esModule = true;
var electron_1 = require("electron");
var hotkey_menu_launcher_1 = require("./hotkey-menu-launcher");
var hotkey_1 = require("./hotkey");
electron_1.app.on("ready", function () {
    var hotkeys = new hotkey_menu_launcher_1.HotkeyMenu();
    hotkeys.addHotkey(new hotkey_1.Hotkey(function () {
        console.log("Hotkey pressed");
    }, "Test hotkey", "CommandOrControl+S"));
    hotkeys.registerHotkeysGlobal();
    hotkeys.displayMenu();
});
//# sourceMappingURL=main.js.map