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


## 3. Deployment Guide

This section provides step-by-step instructions for deploying the Manus Desktop application on various Linux distributions. The application is available in several formats to ensure broad compatibility and ease of installation.

### 3.1. Prerequisites

Before proceeding with the installation, ensure your system meets the following basic requirements:

*   **64-bit Linux Distribution**: The application is built for 64-bit systems.
*   **Internet Connection**: Required for downloading the application packages and initial setup.
*   **Basic Terminal Knowledge**: Familiarity with executing commands in the Linux terminal.

### 3.2. Installation Methods

Manus Desktop for Linux can be installed using AppImage, DEB packages (for Debian/Ubuntu-based systems), or Snap packages. Choose the method that best suits your distribution and preference.

#### 3.2.1. AppImage (Recommended for Broad Compatibility)

AppImage is a universal software package format that allows you to run applications on most Linux distributions without needing to install them system-wide. It's a great option for users who prefer not to deal with package managers or system dependencies.

**Steps:**

1.  **Download the AppImage**: Navigate to the [Releases page](https://github.com/wsochi4-os/manus-desktop-linux/releases) of the `manus-desktop-linux` repository and download the latest `Manus-x.x.x.AppImage` file. Replace `x.x.x` with the actual version number.

2.  **Make the AppImage Executable**: Open your terminal, navigate to the directory where you downloaded the AppImage (e.g., `~/Downloads`), and make it executable using the `chmod` command:

    ```bash
    chmod +x Manus-x.x.x.AppImage
    ```

3.  **Run the AppImage**: You can now run the application by double-clicking the file in your file manager or by executing it from the terminal:

    ```bash
    ./Manus-x.x.x.AppImage
    ```

    *Optional*: For better integration with your desktop environment (e.g., adding to application menus), consider installing `AppImageLauncher`.

#### 3.2.2. DEB Package (for Debian/Ubuntu-based Systems)

DEB packages are standard for Debian, Ubuntu, Linux Mint, Pop!_OS, and other related distributions. This method integrates the application more deeply with your system.

**Steps:**

1.  **Download the DEB Package**: Go to the [Releases page](https://github.com/wsochi4-os/manus-desktop-linux/releases) and download the latest `manus-desktop-x.x.x.deb` file.

2.  **Install the DEB Package**: Open your terminal, navigate to the download directory, and install the package using `dpkg` or `apt`:

    ```bash
    sudo dpkg -i manus-desktop-x.x.x.deb
    # If there are dependency issues, run:
    sudo apt install -f
    ```

    Alternatively, you can often double-click the `.deb` file to open it with your system's software installer.

3.  **Launch the Application**: After installation, you can find the Manus Desktop application in your applications menu.
