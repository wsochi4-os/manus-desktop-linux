# Manus Linux Desktop - MCP Integration Update

## What's New

This update adds **Model Context Protocol (MCP)** support to the Manus Linux Desktop application, enabling advanced "computer use" capabilities through the **DesktopCommanderMCP** server.

## Key Features

### 1. **Advanced Computer Use Capabilities**
The application now provides access to a comprehensive set of tools for system interaction:

*   **Terminal Command Execution:** Execute shell commands with output streaming and timeout support.
*   **File System Operations:** Read, write, create, delete, and manage files and directories.
*   **Process Management:** List, monitor, and control running processes.
*   **Code Execution:** Execute Python, Node.js, and R code in memory without saving files.
*   **Data Analysis:** Analyze CSV, JSON, and Excel files instantly.
*   **Document Support:** Read, write, and edit Excel, PDF, and Word documents.

### 2. **Seamless Integration**
The MCP server is automatically launched when the Electron app starts and is gracefully shut down when the app closes. The integration is transparent to the user.

### 3. **Secure API**
The integration maintains Electron's context isolation and provides a secure IPC bridge between the renderer process (web interface) and the main process (MCP client).

## Project Structure

```
manus-desktop-linux/
├── index.js                    # Main Electron process with MCP integration
├── preload.js                  # Preload script exposing secure APIs
├── mcp-manager.js              # MCP client and server lifecycle management
├── package.json                # Project dependencies and scripts
├── offline.html                # Enhanced offline page with MCP status display
├── icon.png                    # Application icon
├── IMPLEMENTATION_PLAN.md      # Detailed implementation architecture
├── MCP_INTEGRATION.md          # User guide for MCP API usage
└── README_MCP.md               # This file
```

## Installation and Setup

### Prerequisites

*   Node.js 14+ with npm
*   Linux system (tested on Ubuntu 20.04+)
*   Internet connection for initial dependency installation

### Installation Steps

1. **Clone the repository:**
   ```bash
   git clone https://github.com/wsochi4-os/manus-desktop-linux.git
   cd manus-desktop-linux
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the application:**
   ```bash
   npm start
   ```

### Building the Application

To build the application for distribution:

```bash
npm run build
```

This creates distributable packages (AppImage, deb, snap) in the `dist/` directory.

## Usage

### From the Web Interface

The Manus web interface (running inside the Electron window) can access MCP tools through the `window.mcpAPI` object:

```javascript
// Check MCP connection status
const status = await window.mcpAPI.getStatus();
console.log('Connected:', status.connected);
console.log('Available tools:', status.toolCount);

// Get list of available tools
const toolsResponse = await window.mcpAPI.getTools();
console.log('Tools:', toolsResponse.data);

// Call an MCP tool
const result = await window.mcpAPI.callTool('execute_command', {
  command: 'ls -la /home'
});

if (result.success) {
  console.log('Output:', result.data);
} else {
  console.error('Error:', result.error);
}
```

### Offline Mode

When the application cannot connect to `manus.im`, it displays an enhanced offline page that shows:

*   Current MCP connection status
*   Number of available tools
*   List of available features
*   Options to check MCP status or reload the app

## Architecture

The MCP integration follows a three-tier architecture:

1. **Renderer Process (Web Interface):** The Manus web interface running in the Electron BrowserWindow.
2. **Main Process (IPC Bridge):** The Electron main process acts as an IPC bridge, forwarding requests from the renderer to the MCP client.
3. **MCP Client & Server:** The MCP client in the main process communicates with the DesktopCommanderMCP server via stdio transport.

### Data Flow

```
Web Interface (renderer)
    ↓
window.mcpAPI.callTool()
    ↓
ipcRenderer.invoke('mcp-call-tool', ...)
    ↓
Electron Main Process
    ↓
ipcMain.handle('mcp-call-tool', ...)
    ↓
MCPManager.callTool()
    ↓
MCP Client
    ↓
DesktopCommanderMCP Server (stdio)
    ↓
System Operations
```

## Security Considerations

*   **Context Isolation:** The Electron application maintains context isolation to prevent direct access to Node.js APIs from the renderer process.
*   **IPC Validation:** All IPC requests are validated in the main process before being forwarded to the MCP client.
*   **Whitelist-Based API:** Only whitelisted IPC channels are exposed to the renderer process.
*   **User Consent:** Future versions may include user confirmation dialogs for sensitive operations.

## Troubleshooting

### MCP Server Fails to Start

**Symptoms:** The offline page shows "MCP Status: Disconnected"

**Solutions:**
1. Ensure Node.js is installed: `node --version`
2. Check if `@wonderwhy-er/desktop-commander` can be installed: `npx @wonderwhy-er/desktop-commander@latest --help`
3. Check available disk space and memory
4. Review the Electron console for detailed error messages (Ctrl+Shift+I)

### Tools Not Available

**Symptoms:** `window.mcpAPI.getTools()` returns an empty array

**Solutions:**
1. Check MCP connection status: `await window.mcpAPI.getStatus()`
2. Wait a few seconds for the server to fully initialize
3. Check the console for error messages
4. Try reloading the app (Ctrl+Shift+R)

### High Memory Usage

**Symptoms:** The application uses significant memory

**Solutions:**
1. The MCP server typically uses 50-100 MB of memory
2. Limit Node.js memory: `NODE_OPTIONS="--max-old-space-size=512"`
3. Close unnecessary applications to free up system resources

## Development

### Adding New Features

To extend the MCP integration:

1. **Update `mcp-manager.js`:** Add new methods to handle additional MCP operations if needed.
2. **Update `index.js`:** Add new IPC handlers for new operations.
3. **Update `preload.js`:** Expose new methods to the renderer process via `window.mcpAPI`.

### Testing

To test the MCP integration locally:

1. Start the Electron app: `npm start`
2. Open the Developer Console (Ctrl+Shift+I)
3. Test the MCP API in the console:

```javascript
// Check connection
await window.mcpAPI.getStatus();

// Get tools
const tools = await window.mcpAPI.getTools();
console.log(tools);

// Call a tool
const result = await window.mcpAPI.callTool('execute_command', {
  command: 'echo "Hello from MCP"'
});
console.log(result);
```

## Performance

*   **Startup Time:** MCP server initialization adds approximately 2-5 seconds to app startup.
*   **Memory Usage:** The MCP server typically uses 50-100 MB of additional memory.
*   **Tool Execution:** Execution time depends on the specific operation and system load.

## Future Enhancements

*   **GUI Automation:** Integration of `kwin-mcp` for KDE Plasma users to enable GUI automation.
*   **Tool Restrictions:** Implement a permission system to restrict access to sensitive tools.
*   **Caching:** Cache tool lists and frequently used results to improve performance.
*   **Error Recovery:** Implement automatic reconnection and recovery mechanisms for server failures.
*   **Custom Tools:** Allow users to register custom MCP tools.

## References

*   [DesktopCommanderMCP GitHub Repository](https://github.com/wonderwhy-er/DesktopCommanderMCP)
*   [Model Context Protocol Documentation](https://modelcontextprotocol.io/)
*   [Electron Documentation](https://www.electronjs.org/docs)
*   [MCP Integration Guide](./MCP_INTEGRATION.md)
*   [Implementation Plan](./IMPLEMENTATION_PLAN.md)

## License

MIT License - See LICENSE file for details

## Support

For issues, questions, or contributions, please visit the [GitHub repository](https://github.com/wsochi4-os/manus-desktop-linux).
