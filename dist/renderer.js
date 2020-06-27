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
        var body = document.getElementsByTagName('body')[0];
        var table = document.createElement("table");
        var tbody = document.createElement("tbody");
        hotkeys.forEach(function (f) {
            var tr = document.createElement("tr");
            var label = document.createElement("td");
            label.innerHTML = f.label;
            tr.appendChild(label);
            var inputTd = document.createElement("td");
            var input = document.createElement("input");
            inputTd.appendChild(input);
            tr.appendChild(inputTd);
            tbody.appendChild(tr);
        });
        table.appendChild(tbody);
        body.appendChild(table);
    });
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
gatherHotkeys();
//# sourceMappingURL=renderer.js.map