"use strict";
exports.__esModule = true;
exports.HotkeyMenu = void 0;
var electron_1 = require("electron");
var HotkeyMenu = /** @class */ (function () {
    function HotkeyMenu() {
        this.hotkeys = [];
    }
    HotkeyMenu.prototype.addHotkey = function (hotkey) {
        this.hotkeys.push(hotkey);
    };
    HotkeyMenu.prototype.registerHotkeysGlobal = function () {
        this.hotkeys.forEach(function (key) {
            electron_1.globalShortcut.register(key.shortcut, key.onPress);
        });
    };
    HotkeyMenu.prototype.displayMenu = function () {
        var _this = this;
        var win = new electron_1.BrowserWindow({
            width: 600,
            height: 900,
            autoHideMenuBar: true,
            webPreferences: {
                nodeIntegration: true
            }
        });
        win.loadFile("../lib/menu.html");
        win.webContents.openDevTools();
        console.log(JSON.stringify(this.hotkeys));
        electron_1.ipcMain.on('variable-request', function (event, arg) {
            event.sender.send('variable-reply', JSON.stringify(_this.hotkeys));
        });
    };
    return HotkeyMenu;
}());
exports.HotkeyMenu = HotkeyMenu;
//# sourceMappingURL=hotkey-menu-launcher.js.map