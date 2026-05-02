# Manus Desktop for Linux (Enhanced)

A powerful, native-like desktop wrapper for Manus built with Electron, specifically optimized for Linux systems. This version goes beyond a simple web wrapper by implementing the core "My Computer" local agent capabilities found in the official Windows and macOS versions.

## 🌟 Key Features

- **My Computer Integration**: Enables Manus to interact with your local file system and execute terminal commands (via secure IPC bridge).
- **System Tray Support**: Runs in the background with a dedicated tray icon for quick access.
- **Global Shortcut**: Summon Manus instantly from anywhere using `Alt + Space`.
- **Wayland Optimized**: Automatically detects Wayland sessions and applies necessary Electron flags for crisp rendering.
- **Window State Persistence**: Remembers your window position and size across restarts.
- **Security First**: Uses `contextIsolation` and a dedicated `preload.js` script to ensure secure communication between the web app and your system.
- **Offline Support**: Custom error page with intelligent retry logic.

## 🚀 Installation

### Using AppImage (Recommended)
1. Download the latest `Manus-x.x.x.AppImage` from the Releases page.
2. Make it executable:
   ```bash
   chmod +x Manus-x.x.x.AppImage
   ```
3. Run it:
   ```bash
   ./Manus-x.x.x.AppImage
   ```

### Native Packages
We provide `.deb` for Debian/Ubuntu-based systems and `.snap` packages.

## 🛠️ Development & Building

### Prerequisites
- Node.js (v18 or higher)
- npm or pnpm

### Setup
```bash
git clone https://github.com/wsochi4-os/manus-desktop-linux.git
cd manus-desktop-linux
npm install
```

### Run in Development
```bash
npm start
```

### Build for Linux
```bash
npm run build
```
The packaged apps will be available in the `dist/` directory.

## ⌨️ Shortcuts
- **Alt + Space**: Toggle Manus window visibility.
- **Ctrl + R**: Reload the application.

## 🛡️ Security
This application uses Electron's best practices for security:
- `nodeIntegration` is disabled in the renderer.
- `contextIsolation` is enabled.
- All system-level operations (file access, command execution) are handled via a secure IPC bridge in `preload.js`.

## 📄 License
MIT License - see the [LICENSE](LICENSE) file for details.
