import { remote, app, BrowserWindow } from 'electron';
import * as fs from 'fs';
import * as path from 'path';
import * as pkgDir from 'pkg-dir';

interface MenuOptions {
  width?: number;
  height?: number;
  hotkeys?: Hotkey[];
  css?: string;
  savefile? : string;
}

const DEFAULT_WIDTH = 300;
const DEFAULT_HEIGHT = 300;

export class HotkeyMenu {
  hotkeys: Hotkey[] = [];
  private options: MenuOptions;


  /*
   * width/height: Dimensions of HotkeyMenu
   * hotkeys: Array of Hotkey objects
   * css: Custom css to overload the default css
  */
  constructor(options: MenuOptions) {
    if (!options.width) {
      options.width = DEFAULT_WIDTH;
    }

    if (!options.height) {
      options.height = DEFAULT_HEIGHT;
    }

    if (options.hotkeys) {
      options.hotkeys.forEach((f) => {
        this.addHotkey(f);
      });
    }

    if (!options.savefile) {
        options.savefile = "hotkeys.json"
    }

    this.options = options;

    try {
      fs.readFileSync(this.options.savefile);
    } catch {
      fs.createWriteStream(this.options.savefile);
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

  reloadHotkeysFromFile() {
    const hotkeysFile: Hotkey[] = this.readHotkeysFile();
    this.hotkeys.forEach((currentHotkey) => {
      hotkeysFile.forEach((newHotkey) => {
        if (currentHotkey.label === newHotkey.label) {
          currentHotkey.shortcut = newHotkey.shortcut;
        }
      });
    });
  }

  private readHotkeysFile(): Hotkey[] {
    let hotkeysFile: Hotkey[] = [];
    try {
      hotkeysFile = JSON.parse(fs.readFileSync(this.options.savefile).toString());
    } catch (e) {
      hotkeysFile = JSON.parse('[]');
    }

    return hotkeysFile;
  }

  registerHotkeysGlobal() {
    this.hotkeys.forEach((key) => {
      if (key.shortcut) {
          key.registerHotkeyGlobal()
      }
    });
  }

  unregisterHotkeysGlobal() {
    this.hotkeys.forEach((key) => {
        key.unregisterHotkeyGlobal()
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

    win.webContents.openDevTools()

    this.loadMenuLogic(win)
  }

  private loadMenuLogic(win : BrowserWindow) {
    win.setMenu(null);
    win.loadFile(path.join(pkgDir.sync(), 'node_modules/electron-hotkey-menu/resources/menu.html'));

    win.on('close', (e : Event) => {
      this.unregisterHotkeysGlobal();

      this.reloadHotkeysFromFile();

      this.registerHotkeysGlobal();
    });

    this.sendCSSToMenu()
  }

  private sendCSSToMenu() {
      remote.ipcMain.on('css-request', (event,arg) => {
          event.sender.send('css-reply', this.options.css);
      })
  }

  private writeToFile() {
    const data = JSON.stringify(this.hotkeys);
    fs.writeFileSync(this.options.savefile, data);
  }
}

// Holds a single hotkey
export class Hotkey {
  label: string;
  shortcut: Electron.Accelerator;
  onPress: () => any;

  constructor(label: string, key: Electron.Accelerator = '', onPress: () => any) {
    this.onPress = onPress;
    this.label = label;
    this.shortcut = key;
  }

  registerHotkeyGlobal() {
      if (this.shortcut) {
          remote.globalShortcut.register(this.shortcut, this.onPress)
      }
  }

  unregisterHotkeyGlobal() {
      if (this.shortcut) {
          remote.globalShortcut.unregister(this.shortcut)
      }
  }
}
