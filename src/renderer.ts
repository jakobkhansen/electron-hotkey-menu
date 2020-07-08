import { ipcRenderer, ipcMain, remote } from 'electron';
import * as fs from 'fs';
import * as path from 'path';
import { Hotkey } from './hotkey-menu-launcher';
import * as pkgDir from 'pkg-dir';

const modifiers = [16, 17, 18, 91, 225];
const specialKeys: Record<number, string> = {
  32: 'Space',
};

function initMenu() {
  // Get hotkeys
  const hotkeys: Hotkey[] = JSON.parse(fs.readFileSync('hotkeys.json').toString());

  // Create table
  const body = document.getElementsByTagName('body')[0];
  const table = document.createElement('table');
  const tbody = document.createElement('tbody');

  // Build hotkey field
  hotkeys.forEach((f) => {
    const tr = document.createElement('tr');

    // Build label
    const label = document.createElement('td');
    label.innerHTML = f.label;
    tr.appendChild(label);

    // Build clear button

    // Build input
    const inputTd = document.createElement('td');
    const input = document.createElement('input');

    const buttonTd = document.createElement('td');
    const button = document.createElement('button');

    inputTd.width = '40%';
    button.innerHTML = 'Clear';
    inputTd.appendChild(input);
    buttonTd.appendChild(button);
    tr.appendChild(buttonTd);
    tr.appendChild(inputTd);

    // Setup inputfield logic
    initInputField(f, input, button);

    tbody.appendChild(tr);
  });

  // Build table
  table.appendChild(tbody);
  body.prepend(table);
  initButtons(hotkeys);

  loadCustomCSS();
}

function initInputField(hotkey: Hotkey, input: HTMLInputElement, clear: HTMLButtonElement) {
  input.readOnly = true;
  input.value = hotkey.shortcut.toString();

  const onPressFunc = (event: KeyboardEvent) => {
    onKeyPress(hotkey, input, event);
  };

  input.onfocus = () => {
    document.addEventListener('keydown', onPressFunc);
  };

  input.onblur = () => {
    document.removeEventListener('keydown', onPressFunc);
  };

  clear.onclick = () => {
    hotkey.shortcut = '';
    input.value = '';
  };
}

function onKeyPress(hotkey: Hotkey, input: HTMLInputElement, event: KeyboardEvent) {
  // Ignore only modifier keypresses
  if (modifiers.includes(event.keyCode)) {
    return;
  }

  hotkey.shortcut = '';

  if (event.metaKey) {
    hotkey.shortcut += 'Super+';
  }

  if (event.ctrlKey) {
    hotkey.shortcut += 'CmdOrCtrl+';
  }

  if (event.altKey) {
    hotkey.shortcut += 'Alt+';
  }

  if (event.shiftKey) {
    hotkey.shortcut += 'Shift+';
  }

  if (event.keyCode in specialKeys) {
    hotkey.shortcut += specialKeys[event.keyCode];
  } else {
    hotkey.shortcut += event.key;
  }

  input.value = hotkey.shortcut.toString();
}

function initButtons(hotkeys: Hotkey[]) {
  const cancel = document.getElementById('cancel');
  const confirm = document.getElementById('confirm');

  cancel.onclick = () => {
    remote.getCurrentWindow().close();
  };

  confirm.onclick = () => {
    fs.writeFileSync('hotkeys.json', JSON.stringify(hotkeys));
    remote.getCurrentWindow().close();
  };
}

function loadCustomCSS() {
  const cssFilename = gatherCSSPathFromMain();
  cssFilename.then((result) => {
    loadCSSIntoWindow(result);
  });
}

function gatherCSSPathFromMain(): Promise<string> {
  return new Promise((resolve) => {
    ipcRenderer.send('css-request', ['hotkeys']);

    ipcRenderer.on('css-reply', (event, args) => {
      resolve(args);
    });
  });
}

function loadCSSIntoWindow(relativePath: string) {
  const absolutePath = path.join(pkgDir.sync(), relativePath);

  const head = document.getElementsByTagName('HEAD')[0];
  // Create new link Element
  const link = document.createElement('link');

  // set the attributes for link element
  link.rel = 'stylesheet';
  link.type = 'text/css';
  link.href = absolutePath;
  // Append link element to HTML head
  head.appendChild(link);
}

initMenu();
