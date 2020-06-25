"use strict";
exports.__esModule = true;
var electron_1 = require("electron");
function gatherHotkeys() {
    console.log("Gathering hotkeys...");
    electron_1.ipcRenderer.send("variable-request", ["hotkeys"]);
    electron_1.ipcRenderer.on("variable-reply", function (event, args) {
        console.log(args);
        var hotkeys = JSON.parse(args);
        console.log(hotkeys);
    });
}
gatherHotkeys();
//# sourceMappingURL=renderer.js.map