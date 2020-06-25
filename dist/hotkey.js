"use strict";
exports.__esModule = true;
exports.Hotkey = void 0;
var Hotkey = /** @class */ (function () {
    function Hotkey(onPress, label, key) {
        if (key === void 0) { key = ""; }
        this.onPress = onPress;
        this.label = label;
        this.shortcut = key;
    }
    return Hotkey;
}());
exports.Hotkey = Hotkey;
//# sourceMappingURL=hotkey.js.map