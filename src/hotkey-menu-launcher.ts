import { remote, app } from 'electron'
import * as fs from 'fs'
import * as path from "path"
import * as pkgDir from "pkg-dir"

interface MenuOptions {
  width?: number;
  height?: number;
  hotkeys?: Hotkey[];
}

const DEFAULT_WIDTH = 300;
const DEFAULT_HEIGHT = 300;

export class HotkeyMenu {
  hotkeys: Hotkey[] = [];
  options: MenuOptions;

  constructor(options: MenuOptions) {
    if (!options.width) {
      options.width = DEFAULT_WIDTH;
    }

    if (!options.height) {
      options.height = DEFAULT_HEIGHT;
    }

    if (options.hotkeys) {
        options.hotkeys.forEach(f => {
            this.addHotkey(f)
        })
    }

    this.options = options;

    try {
      fs.readFileSync('hotkeys.json');
    } catch {
      fs.createWriteStream('hotkeys.json');
    }
  }

  addHotkey(hotkey: Hotkey) {
    const hotkeysFile = this.readHotkeysFile();

    hotkeysFile.forEach((f) => {
      if (f.label === hotkey.label) {
        hotkey.shortcut = f.shortcut;
      }
    });

    this.hotkeys.push(hotkey);

    this.writeToFile();
  }

  reloadHotkeys() {
    const hotkeysFile: Hotkey[] = this.readHotkeysFile();
    this.hotkeys.forEach((currentHotkey) => {
      hotkeysFile.forEach((newHotkey) => {
        if (currentHotkey.label === newHotkey.label) {
          currentHotkey.shortcut = newHotkey.shortcut;
        }
      });
    });
  }

  readHotkeysFile(): Hotkey[] {
    let hotkeysFile: Hotkey[] = [];
    try {
      hotkeysFile = JSON.parse(fs.readFileSync('hotkeys.json').toString());
    } catch (e) {
      hotkeysFile = JSON.parse('[]');
    }

    return hotkeysFile;
  }

  registerHotkeysGlobal() {
    this.hotkeys.forEach((key) => {
      if (key.shortcut) {
        remote.globalShortcut.register(key.shortcut, key.onPress);
      }
    });
  }

  unregisterHotkeysGlobal() {
    this.hotkeys.forEach((key) => {
      if (key.shortcut) {
        remote.globalShortcut.unregister(key.shortcut);
      }
    });
  }

  displayMenu() {
    const win = new remote.BrowserWindow({
      width: this.options.width,
      height: this.options.width,
      autoHideMenuBar: true,
      webPreferences: {
        enableRemoteModule: true,
        nodeIntegration: true,
      },
    });

    win.setMenu(null);
    win.loadFile(path.join(pkgDir.sync(), "node_modules/electron-hotkey-menu/src/menu.html"))

    win.on('close', (event) => {
      this.unregisterHotkeysGlobal();

      this.reloadHotkeys();

      this.registerHotkeysGlobal();
    });
  }

  writeToFile() {
    const data = JSON.stringify(this.hotkeys);
    fs.writeFileSync('hotkeys.json', data);
  }
}

export class Hotkey {
  label: string;
  shortcut: Electron.Accelerator;
  onPress: () => any;

  constructor(label: string, key: Electron.Accelerator = '', onPress: () => any) {
    this.onPress = onPress;
    this.label = label;
    this.shortcut = key;
  }
}
