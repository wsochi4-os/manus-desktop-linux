const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld(
  "manusAPI", {
    send: (channel, data) => {
      // whitelist channels
      let validChannels = ["toMain", "execute-command", "read-file", "write-file", "list-files", "reload-app", "mcp-request"];
      if (validChannels.includes(channel)) {
        ipcRenderer.send(channel, data);
      }
    },
    receive: (channel, func) => {
      let validChannels = ["fromMain", "command-output", "file-content", "file-list", "error-message", "mcp-status-update"];
      if (validChannels.includes(channel)) {
        // Deliberately strip event as it includes `sender` 
        ipcRenderer.on(channel, (event, ...args) => func(...args));
      }
    },
    invoke: (channel, data) => {
      let validChannels = ["get-app-version", "check-permissions"];
      if (validChannels.includes(channel)) {
        return ipcRenderer.invoke(channel, data);
      }
    }
  }
);

// Expose MCP API to the renderer process
contextBridge.exposeInMainWorld(
  "mcpAPI", {
    /**
     * Call an MCP tool with the given arguments
     * @param {string} toolName - The name of the tool to call
     * @param {object} args - The arguments to pass to the tool
     * @returns {Promise<object>} The result from the tool
     */
    callTool: async (toolName, args = {}) => {
      return ipcRenderer.invoke('mcp-call-tool', toolName, args);
    },
    
    /**
     * Get the list of available MCP tools
     * @returns {Promise<object>} Object with success flag and tools array
     */
    getTools: async () => {
      return ipcRenderer.invoke('mcp-get-tools');
    },
    
    /**
     * Check the MCP connection status
     * @returns {Promise<object>} Object with connected flag and tool count
     */
    getStatus: async () => {
      return ipcRenderer.invoke('mcp-status');
    }
  }
);
