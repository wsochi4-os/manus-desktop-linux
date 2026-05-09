/**
 * MCP Manager Module
 * Handles the lifecycle of the DesktopCommanderMCP server and provides
 * a client interface for the main Electron process to communicate with it.
 */

const { spawn } = require('child_process');
const path = require('path');

// Use dynamic import for ESM module in CommonJS
let Client, StdioClientTransport;
const mcpPromise = import('@modelcontextprotocol/sdk/client/index.js').then(m => {
  Client = m.Client;
  return import('@modelcontextprotocol/sdk/client/stdio.js');
}).then(m => {
  StdioClientTransport = m.StdioClientTransport;
});

class MCPManager {
  constructor() {
    this.client = null;
    this.serverProcess = null;
    this.isConnected = false;
    this.tools = [];
  }

  /**
   * Initialize the MCP server and connect the client
   */
  async initialize() {
    try {
      console.log('[MCP] Initializing MCP Manager...');
      await mcpPromise;
      
      // Spawn the DesktopCommanderMCP server process
      this.serverProcess = spawn('npx', [
        '@wonderwhy-er/desktop-commander@latest'
      ], {
        stdio: ['pipe', 'pipe', 'pipe'],
        shell: true,
        env: {
          ...process.env,
          NODE_OPTIONS: '--max-old-space-size=512'
        }
      });

      // Set up error handling for the server process
      this.serverProcess.on('error', (err) => {
        console.error('[MCP] Server process error:', err);
        this.isConnected = false;
      });

      this.serverProcess.on('exit', (code, signal) => {
        console.log(`[MCP] Server process exited with code ${code} and signal ${signal}`);
        this.isConnected = false;
      });

      // Create the transport using stdio
      const transport = new StdioClientTransport({
        command: 'npx',
        args: ['@wonderwhy-er/desktop-commander@latest'],
        env: {
          ...process.env,
          NODE_OPTIONS: '--max-old-space-size=512'
        }
      });

      // Initialize the MCP client
      this.client = new Client({
        name: 'manus-desktop-client',
        version: '1.0.0'
      }, {
        capabilities: {}
      });

      // Connect to the server
      await this.client.connect(transport);
      this.isConnected = true;

      // Fetch available tools
      const toolsResponse = await this.client.listTools();
      this.tools = toolsResponse.tools || [];

      console.log(`[MCP] Successfully connected to MCP server. Available tools: ${this.tools.length}`);
      return true;
    } catch (error) {
      console.error('[MCP] Failed to initialize MCP Manager:', error);
      this.isConnected = false;
      return false;
    }
  }

  /**
   * Call an MCP tool with the given arguments
   * @param {string} toolName - The name of the tool to call
   * @param {object} args - The arguments to pass to the tool
   * @returns {Promise<object>} The result from the tool
   */
  async callTool(toolName, args = {}) {
    if (!this.isConnected || !this.client) {
      throw new Error('MCP client is not connected');
    }

    try {
      console.log(`[MCP] Calling tool: ${toolName}`, args);
      const result = await this.client.callTool({
        name: toolName,
        arguments: args
      });

      console.log(`[MCP] Tool result:`, result);
      return result;
    } catch (error) {
      console.error(`[MCP] Error calling tool ${toolName}:`, error);
      throw error;
    }
  }

  /**
   * Get the list of available tools
   * @returns {array} Array of available tools
   */
  getTools() {
    return this.tools;
  }

  /**
   * Check if the MCP client is connected
   * @returns {boolean} Connection status
   */
  isReady() {
    return this.isConnected && this.client !== null;
  }

  /**
   * Gracefully shutdown the MCP server and client
   */
  async shutdown() {
    try {
      console.log('[MCP] Shutting down MCP Manager...');

      if (this.client) {
        await this.client.close();
        this.client = null;
      }

      if (this.serverProcess) {
        this.serverProcess.kill('SIGTERM');
        this.serverProcess = null;
      }

      this.isConnected = false;
      console.log('[MCP] MCP Manager shut down successfully');
    } catch (error) {
      console.error('[MCP] Error during shutdown:', error);
    }
  }
}

module.exports = MCPManager;
