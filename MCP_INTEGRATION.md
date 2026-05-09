# MCP Integration Guide

## Overview

The Manus Linux Desktop application now includes integrated support for the **Model Context Protocol (MCP)** through the **DesktopCommanderMCP** server. This enables advanced "computer use" capabilities, allowing the Manus web interface to securely execute complex operations on your Linux system.

## Architecture

The integration follows a three-tier architecture:

1. **Renderer Process (Web Interface):** The Manus web interface running inside Electron can now call MCP tools through the `window.mcpAPI` object.
2. **Main Process (IPC Bridge):** The Electron main process (`index.js`) acts as an IPC bridge, forwarding MCP requests from the renderer to the MCP client.
3. **MCP Client & Server:** The MCP client (in the main process) communicates with the DesktopCommanderMCP server via standard input/output.

## Using the MCP API

### From the Web Interface

The `window.mcpAPI` object is exposed to the renderer process and provides the following methods:

#### `callTool(toolName, args)`

Call an MCP tool with the given arguments.

```javascript
const result = await window.mcpAPI.callTool('execute_command', {
  command: 'ls -la /home'
});

if (result.success) {
  console.log('Command output:', result.data);
} else {
  console.error('Error:', result.error);
}
```

#### `getTools()`

Retrieve the list of available MCP tools.

```javascript
const response = await window.mcpAPI.getTools();

if (response.success) {
  console.log('Available tools:', response.data);
} else {
  console.error('Error:', response.error);
}
```

#### `getStatus()`

Check the MCP connection status.

```javascript
const status = await window.mcpAPI.getStatus();

console.log('Connected:', status.connected);
console.log('Available tools:', status.toolCount);
```

## Available Tools

The DesktopCommanderMCP server provides a wide range of tools, including:

*   **Terminal Commands:** `execute_command` - Execute shell commands with output streaming and timeout support.
*   **File Operations:** `read_file`, `write_file`, `create_directory`, `list_directory`, `move_file`, `get_file_metadata` - Full file system operations.
*   **Code Execution:** Execute Python, Node.js, or R code in memory without saving files.
*   **Process Management:** `list_processes`, `kill_process` - Manage running processes.
*   **Data Analysis:** Instant analysis of CSV, JSON, and Excel files.
*   **Document Support:** Read, write, and edit Excel, PDF, and Word documents.

For a complete list of tools and their parameters, refer to the [DesktopCommanderMCP documentation](https://github.com/wonderwhy-er/DesktopCommanderMCP).

## Security Considerations

*   **Context Isolation:** The Electron application maintains context isolation to prevent direct access to Node.js APIs from the renderer process.
*   **IPC Validation:** All IPC requests are validated in the main process before being forwarded to the MCP client.
*   **User Consent:** While the current implementation exposes full MCP capabilities, future versions may include user confirmation dialogs for sensitive operations.

## Troubleshooting

### MCP Server Fails to Start

If the MCP server fails to initialize, check the following:

1. **Node.js Installation:** Ensure Node.js is installed and accessible from the command line.
2. **NPM Packages:** Verify that `@wonderwhy-er/desktop-commander` can be installed via `npx`.
3. **System Resources:** Ensure sufficient system resources (memory, disk space) are available.

Check the Electron console for detailed error messages:

```
[MCP] Initializing MCP Manager...
[MCP] Failed to initialize MCP Manager: <error message>
```

### Tools Not Available

If tools are not available after connection:

1. **Check Connection Status:** Use `window.mcpAPI.getStatus()` to verify the connection.
2. **Verify Tool Names:** Ensure you are using the correct tool names from `window.mcpAPI.getTools()`.
3. **Check Arguments:** Verify that the arguments passed to `callTool()` match the tool's expected parameters.

## Development

### Adding New Functionality

To extend the MCP integration:

1. **Update `mcp-manager.js`:** Add new methods to handle additional MCP operations if needed.
2. **Update `index.js`:** Add new IPC handlers for new operations.
3. **Update `preload.js`:** Expose new methods to the renderer process via `window.mcpAPI`.

### Testing

To test the MCP integration locally:

1. Start the Electron app: `npm start`
2. Open the Developer Console (Ctrl+Shift+I)
3. Test the MCP API:

```javascript
// Check connection status
await window.mcpAPI.getStatus();

// Get available tools
const tools = await window.mcpAPI.getTools();
console.log(tools);

// Call a tool
const result = await window.mcpAPI.callTool('execute_command', {
  command: 'echo "Hello from MCP"'
});
console.log(result);
```

## Performance

*   **Startup Time:** MCP server initialization adds approximately 2-5 seconds to the app startup time.
*   **Memory Usage:** The MCP server typically uses 50-100 MB of additional memory.
*   **Tool Execution:** Tool execution time depends on the specific operation and system load.

## Future Enhancements

*   **GUI Automation:** Integration of `kwin-mcp` for KDE Plasma users to enable GUI automation.
*   **Tool Restrictions:** Implement a permission system to restrict access to sensitive tools.
*   **Caching:** Cache tool lists and frequently used results to improve performance.
*   **Error Recovery:** Implement automatic reconnection and recovery mechanisms for server failures.

## References

*   [DesktopCommanderMCP GitHub Repository](https://github.com/wonderwhy-er/DesktopCommanderMCP)
*   [Model Context Protocol Documentation](https://modelcontextprotocol.io/)
*   [Electron IPC Documentation](https://www.electronjs.org/docs/latest/api/ipc-main)
