<h1 align="center">electron-hotkey-menu</h1>
<p>
  <img alt="Version" src="https://img.shields.io/badge/version-1.1.2-blue.svg?cacheSeconds=2592000" />
  <a href="https://github.com/jakobkhansen/electron-hotkey-menu#readme" target="_blank">
    <img alt="Documentation" src="https://img.shields.io/badge/documentation-yes-brightgreen.svg" />
  </a>
  <a href="https://github.com/jakobkhansen/electron-hotkey-menu/graphs/commit-activity" target="_blank">
    <img alt="Maintenance" src="https://img.shields.io/badge/Maintained%3F-yes-green.svg" />
  </a>
  <a href="https://github.com/jakobkhansen/electron-hotkey-menu/blob/master/LICENSE" target="_blank">
    <img alt="License: MIT" src="https://img.shields.io/github/license/jakobkhansen/electron-hotkey-menu" />
  </a>
</p>

> Does your Electron app use hotkeys? Do you want your users to configure these hotkeys themselves? This package will create a customizable key-binding menu for you, with simple, non-boilerplate code.

### 🏠 [Homepage](https://github.com/jakobkhansen/electron-hotkey-menu#readme)

## Install

```sh
npm install electron-hotkey-menu
```

## Usage

```typescript
import {HotkeyMenu, Hotkey} from "electron-hotkey-menu"


const hotkeys : HotkeyMenu = new HotkeyMenu({
    // Width and height of menu
    width:400,
    height:400,

    // Custom CSS
    css:'./custom-menu.css',

    // Custom savefile. Use this if you want separate hotkey menus. Defaults to hotkeys.json
    savefile:"custom-hotkey-file.json",

    // Add hotkeys directly
    hotkeys:
        [
            // Label, default shortcut, function to execute
            new Hotkey("Hotkey 1", "Alt+O", () => {
                console.log("Hotkey activated")
            }),
            new Hotkey("Hotkey 2", "", functionName)
        ]
})


// Hotkey added later
hotkeys.addHotkey(new Hotkey("Hotkey 3", "Shift+c", () => {
    console.log("Later added hotkey activated")
}))

// Register hotkeys before showing menu
hotkeys.registerHotkeysGlobal()

// Load menu on a button press
document.getElementById("hotkeys").onclick = () => hotkeys.displayMenu()
```
![alt text](https://github.com/jakobkhansen/electron-hotkey-menu/blob/master/images/menu.png?raw=true)

Hotkeys are saved between program launches and stored by default in `hotkeys.json` where the application was launched. (customizable)

## Author

👤 **Jakob Hansen**

* Github: [@jakobkhansen](https://github.com/jakobkhansen)
* LinkedIn: [@jakob-hansen-b1a9a5174](https://linkedin.com/in/jakob-hansen-b1a9a5174)

## 🤝 Contributing

Contributions, issues and feature requests are welcome!<br />Feel free to check [issues page](https://github.com/jakobkhansen/electron-hotkey-menu/issues).
## Show your support

Give a ⭐️ if this project helped you!

## 📝 License

Copyright © 2020 [Jakob Hansen](https://github.com/jakobkhansen).<br />
This project is [MIT](https://github.com/jakobkhansen/electron-hotkey-menu/blob/master/LICENSE) licensed.

***
_This README was generated with ❤️ by [readme-md-generator](https://github.com/kefranabg/readme-md-generator)_
