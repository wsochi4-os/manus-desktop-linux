# Implementation Plan: Integrating DesktopCommanderMCP into Manus Linux Desktop

## Objective
To enhance the `manus-desktop-linux` application with advanced "computer use" capabilities by integrating `DesktopCommanderMCP`. This will allow the Manus web interface (running inside the Electron wrapper) to securely execute complex terminal commands, manage files, and control processes on the host Linux system.

## Architecture Overview
The integration will follow a client-server architecture within the Electron application:
1.  **MCP Server (Backend):** We will bundle or dynamically install `DesktopCommanderMCP` (via `npx` or as a local dependency). The Electron main process will spawn this server as a child process.
2.  **MCP Client (Main Process):** The Electron main process (`index.js`) will act as the MCP client. It will connect to the spawned `DesktopCommanderMCP` server using standard input/output (stdio) transport.
3.  **IPC Bridge:** We will establish an Inter-Process Communication (IPC) bridge between the Electron renderer process (the web view) and the main process. This allows the web interface to send MCP requests (e.g., "execute this command", "read this file") to the main process.
4.  **Renderer Interface:** The `preload.js` script will expose a secure API (`window.manusAPI.mcp`) to the web interface, abstracting the IPC calls.

## Step-by-Step Implementation

### Phase 1: Dependency Management and Setup
1.  **Update `package.json`:**
    *   Add `@modelcontextprotocol/sdk` as a dependency to implement the MCP client in the main process.
    *   Add `@wonderwhy-er/desktop-commander` as a dependency (or plan to spawn it via `npx` to ensure the latest version). For stability in a desktop app, adding it as a direct dependency is preferred.
2.  **Install Dependencies:** Run `npm install` to fetch the new packages.

### Phase 2: Main Process Implementation (`index.js`)
1.  **Import MCP SDK:** Import the necessary classes from `@modelcontextprotocol/sdk` (e.g., `Client`, `StdioClientTransport`).
2.  **Server Management:**
    *   Create a function to spawn the `DesktopCommanderMCP` server process.
    *   Set up the `StdioClientTransport` to communicate with the spawned process.
    *   Initialize the MCP `Client` and connect it to the transport.
    *   Handle server lifecycle (startup, shutdown, error recovery). Ensure the server process is killed when the Electron app quits.
3.  **IPC Handlers for MCP:**
    *   Register new `ipcMain` handlers to receive requests from the renderer process.
    *   Map these IPC requests to the corresponding MCP client methods (e.g., `client.callTool()`).
    *   Return the results (or errors) back to the renderer process.

### Phase 3: Preload Script Update (`preload.js`)
1.  **Expose MCP API:** Update the `contextBridge.exposeInMainWorld` call to include a new `mcp` object.
2.  **Define Methods:** Add methods like `callTool(name, args)` that wrap the `ipcRenderer.invoke` calls to the main process. This provides a clean, promise-based API for the web frontend.

### Phase 4: Testing and Refinement
1.  **Local Testing:** Run the Electron app locally (`npm start`).
2.  **Verify Connection:** Ensure the MCP server starts correctly and the client connects.
3.  **Test Tools:** Use the developer console in the Electron window to manually call tools exposed by `DesktopCommanderMCP` (e.g., `execute_command`, `read_file`) via the `window.manusAPI.mcp` interface and verify the results.

### Phase 5: Git Commit and Push
1.  **Stage Changes:** Add the modified files (`package.json`, `index.js`, `preload.js`, `IMPLEMENTATION_PLAN.md`).
2.  **Commit:** Create a descriptive commit message detailing the MCP integration.
3.  **Push:** Push the changes to the `main` branch of the `wsochi4-os/manus-desktop-linux` repository.

## Security Considerations
*   **Context Isolation:** Ensure `contextIsolation` remains enabled in the `BrowserWindow` preferences.
*   **IPC Validation:** Validate all inputs received via IPC in the main process before passing them to the MCP client to prevent injection attacks.
*   **Tool Restrictions:** While `DesktopCommanderMCP` provides broad access, consider if certain tools should be restricted or require explicit user confirmation within the Electron app before execution. (For this initial integration, we will expose the full capability, but this is a future consideration).
