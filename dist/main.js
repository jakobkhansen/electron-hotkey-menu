"use strict";
exports.__esModule = true;
var electron_1 = require("electron");
var hotkey_menu_launcher_1 = require("./hotkey-menu-launcher");
electron_1.app.on("ready", function () {
    var hotkeys = new hotkey_menu_launcher_1.HotkeyMenu();
    hotkeys.addHotkey(new hotkey_menu_launcher_1.Hotkey(function () {
        console.log("Hotkey 2 pressed");
    }, "Test hotkey", "CommandOrControl+S"));
    hotkeys.addHotkey(new hotkey_menu_launcher_1.Hotkey(function () {
        console.log("Hotkey 2 pressed");
    }, "Hotkey 2"));
    hotkeys.registerHotkeysGlobal();
    hotkeys.displayMenu();
});
//# sourceMappingURL=main.js.map