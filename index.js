const { app, BrowserWindow, Tray, Menu, shell, ipcMain, globalShortcut } = require('electron');
const path = require('path');
const fs = require('fs');
const { exec } = require('child_process');
const windowStateKeeper = require('electron-window-state');

let mainWindow;
let tray;

// Handle Wayland support
if (process.env.XDG_SESSION_TYPE === 'wayland') {
  app.commandLine.appendSwitch('enable-features', 'UseOzonePlatform');
  app.commandLine.appendSwitch('ozone-platform', 'wayland');
}

function createWindow() {
  const mainWindowState = windowStateKeeper({
    defaultWidth: 1200,
    defaultHeight: 800
  });

  mainWindow = new BrowserWindow({
    x: mainWindowState.x,
    y: mainWindowState.y,
    width: mainWindowState.width,
    height: mainWindowState.height,
    title: 'Manus',
    icon: path.join(__dirname, 'icon.png'),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    },
  });

  mainWindowState.manage(mainWindow);

  mainWindow.loadURL('https://manus.im').catch(err => {
    console.error('Failed to load URL:', err);
    mainWindow.loadFile(path.join(__dirname, 'offline.html'));
  });

  // Security: Open external links in default browser
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (!url.startsWith('https://manus.im')) {
      shell.openExternal(url);
      return { action: 'deny' };
    }
    return { action: 'allow' };
  });

  mainWindow.on('close', (event) => {
    if (!app.isQuitting) {
      event.preventDefault();
      mainWindow.hide();
    }
  });
}

function createTray() {
  const iconPath = path.join(__dirname, 'icon.png');
  if (!fs.existsSync(iconPath)) return;

  tray = new Tray(iconPath);
  const contextMenu = Menu.buildFromTemplate([
    { label: 'Show Manus', click: () => mainWindow.show() },
    { type: 'separator' },
    { label: 'Quit', click: () => {
        app.isQuitting = true;
        app.quit();
      }
    }
  ]);
  tray.setToolTip('Manus Desktop');
  tray.setContextMenu(contextMenu);
  tray.on('click', () => {
    mainWindow.isVisible() ? mainWindow.hide() : mainWindow.show();
  });
}

// IPC Handlers for "My Computer" features
ipcMain.on('execute-command', (event, command) => {
  // In a real app, this would require explicit user permission per command
  exec(command, (error, stdout, stderr) => {
    event.reply('command-output', { stdout, stderr, error: error ? error.message : null });
  });
});

ipcMain.on('read-file', (event, filePath) => {
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) event.reply('error-message', `Failed to read file: ${err.message}`);
    else event.reply('file-content', data);
  });
});

ipcMain.on('write-file', (event, { filePath, content }) => {
  fs.writeFile(filePath, content, 'utf8', (err) => {
    if (err) event.reply('error-message', `Failed to write file: ${err.message}`);
    else event.reply('fromMain', 'File written successfully');
  });
});

ipcMain.on('reload-app', () => {
  if (mainWindow) mainWindow.loadURL('https://manus.im');
});

app.whenReady().then(() => {
  createWindow();
  createTray();

  // Register Global Shortcut (Alt+Space to toggle)
  globalShortcut.register('Alt+Space', () => {
    if (mainWindow.isVisible()) {
      mainWindow.hide();
    } else {
      mainWindow.show();
      mainWindow.focus();
    }
  });
});

app.on('will-quit', () => {
  globalShortcut.unregisterAll();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
