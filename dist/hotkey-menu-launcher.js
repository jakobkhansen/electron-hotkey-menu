"use strict";
exports.__esModule = true;
exports.Hotkey = exports.HotkeyMenu = void 0;
var electron_1 = require("electron");
var fs = require("fs");
var DEFAULT_WIDTH = 300;
var DEFAULT_HEIGHT = 300;
var HotkeyMenu = /** @class */ (function () {
    function HotkeyMenu(options) {
        this.hotkeys = [];
        if (!options.width) {
            options.width = DEFAULT_WIDTH;
        }
        if (!options.height) {
            options.height = DEFAULT_HEIGHT;
        }
        this.options = options;
        try {
            fs.readFileSync("hotkeys.json");
        }
        catch (_a) {
            fs.createWriteStream("hotkeys.json");
        }
    }
    HotkeyMenu.prototype.addHotkey = function (hotkey) {
        var hotkeysFile = this.readHotkeysFile();
        hotkeysFile.forEach(function (f) {
            if (f.label === hotkey.label) {
                hotkey.shortcut = f.shortcut;
            }
        });
        this.hotkeys.push(hotkey);
        this.writeToFile();
    };
    HotkeyMenu.prototype.reloadHotkeys = function () {
        var hotkeysFile = this.readHotkeysFile();
        this.hotkeys.forEach(function (currentHotkey) {
            hotkeysFile.forEach(function (newHotkey) {
                if (currentHotkey.label === newHotkey.label) {
                    currentHotkey.shortcut = newHotkey.shortcut;
                }
            });
        });
    };
    HotkeyMenu.prototype.readHotkeysFile = function () {
        var hotkeysFile = [];
        try {
            hotkeysFile = JSON.parse(fs.readFileSync("hotkeys.json").toString());
        }
        catch (e) {
            hotkeysFile = JSON.parse("[]");
        }
        return hotkeysFile;
    };
    HotkeyMenu.prototype.registerHotkeysGlobal = function () {
        this.hotkeys.forEach(function (key) {
            if (key.shortcut) {
                electron_1.remote.globalShortcut.register(key.shortcut, key.onPress);
            }
        });
    };
    HotkeyMenu.prototype.unregisterHotkeysGlobal = function () {
        this.hotkeys.forEach(function (key) {
            if (key.shortcut) {
                electron_1.remote.globalShortcut.unregister(key.shortcut);
            }
        });
    };
    HotkeyMenu.prototype.displayMenu = function () {
        var _this = this;
        var win = new electron_1.remote.BrowserWindow({
            width: this.options.width,
            height: this.options.width,
            autoHideMenuBar: true,
            webPreferences: {
                enableRemoteModule: true,
                nodeIntegration: true
            }
        });
        win.setMenu(null);
        win.loadFile("../lib/menu.html");
        win.on("close", function (event) {
            _this.unregisterHotkeysGlobal();
            _this.reloadHotkeys();
            _this.registerHotkeysGlobal();
        });
    };
    HotkeyMenu.prototype.writeToFile = function () {
        var data = JSON.stringify(this.hotkeys);
        fs.writeFileSync("hotkeys.json", data);
    };
    return HotkeyMenu;
}());
exports.HotkeyMenu = HotkeyMenu;
var Hotkey = /** @class */ (function () {
    //constructor(onPress : () => any, label : string, key : Electron.Accelerator = "")  {
    //this.onPress = onPress
    //this.label = label
    //this.shortcut = key
    //}
    function Hotkey(label, key, onPress) {
        if (key === void 0) { key = ""; }
        this.onPress = onPress;
        this.label = label;
        this.shortcut = key;
    }
    return Hotkey;
}());
exports.Hotkey = Hotkey;
//# sourceMappingURL=hotkey-menu-launcher.js.map