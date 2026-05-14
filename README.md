# Manus Desktop for Linux

This is an Electron-based desktop application for Linux that provides a native wrapper for the Manus web interface, including system tray integration and a global keyboard shortcut.

## Features

*   **Webview to Manus.ai**: Access the Manus web interface directly from your desktop.
*   **System Tray Icon**: Easily manage the application from your system tray.
*   **Global Keyboard Shortcut**: Quickly show or hide the application with `Ctrl+Alt+M`.
*   **Cross-platform Packaging**: Available as `.deb` and `AppImage` for easy installation on various Linux distributions.

## Installation

### .deb Package (for Debian/Ubuntu-based systems)

1.  **Download the .deb package**:
    Download the latest `.deb` package from the [releases page](https://github.com/wsochi4-os/manus-desktop-linux/releases).

2.  **Install the package**:
    Open your terminal and navigate to the directory where you downloaded the `.deb` file. Then, run the following commands:
    ```bash
    sudo dpkg -i manus-desktop-linux_1.0.0_amd64.deb
    sudo apt install -f # To install any missing dependencies
    ```

3.  **Launch the application**:
    You can find "Manus Desktop" in your applications menu or launch it from the terminal:
    ```bash
    manus-desktop-linux
    ```

### AppImage (for various Linux distributions)

1.  **Download the AppImage**:
    Download the latest `.AppImage` file from the [releases page](https://github.com/wsochi4-os/manus-desktop-linux/releases).

2.  **Make the AppImage executable**:
    Open your terminal and navigate to the directory where you downloaded the `.AppImage` file. Then, run the following command:
    ```bash
    chmod +x "Manus Desktop-1.0.0.AppImage"
    ```

3.  **Run the AppImage**:
    ```bash
    ./"Manus Desktop-1.0.0.AppImage"
    ```

## Development

To set up the development environment and build the application from source:

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/wsochi4-os/manus-desktop-linux.git
    cd manus-desktop-linux
    ```

2.  **Install dependencies**:
    ```bash
    pnpm install
    ```

3.  **Run the application in development mode**:
    ```bash
    pnpm start
    ```

4.  **Build packages**:
    To build the `.deb` and `AppImage` packages, run:
    ```bash
    pnpm run build
    ```
    The built packages will be located in the `dist/` directory.

## Contributing

Feel free to open issues or submit pull requests on the [GitHub repository](https://github.com/wsochi4-os/manus-desktop-linux).

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.
