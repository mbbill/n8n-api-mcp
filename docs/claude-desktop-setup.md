# Claude Desktop Integration

This document explains how to integrate the n8n MCP server with Claude Desktop.

## Configuration

### 1. Build the MCP Server

First, build the project:

```bash
npm install
npm run build
```

### 2. Set Environment Variables

Create a `.env` file in the project root:

```env
N8N_API_URL=http://localhost:5678/api/v1
N8N_API_KEY=your_actual_api_key_here
LOG_LEVEL=info
```

To get your n8n API key:
1. Open your n8n instance
2. Go to Settings > Personal Settings
3. Generate a new API key

### 3. Configure Claude Desktop

Add the n8n MCP server to your Claude Desktop configuration file:

**On macOS:**
`~/Library/Application Support/Claude/claude_desktop_config.json`

**On Windows:**
`%APPDATA%\Claude\claude_desktop_config.json`

Add this configuration:

```json
{
  "mcpServers": {
    "n8n": {
      "command": "node",
      "args": ["C:\\path\\to\\n8n-mcp-server\\dist\\index.js"],
      "env": {
        "N8N_API_URL": "http://localhost:5678/api/v1",
        "N8N_API_KEY": "your_actual_api_key_here"
      }
    }
  }
}
```

Replace `C:\\path\\to\\n8n-mcp-server` with the actual path to this project.

### 4. Restart Claude Desktop

After saving the configuration, restart Claude Desktop completely to load the new MCP server.

## Usage Examples

Once configured, you can use natural language commands in Claude Desktop:

### Workflow Management

- "List all my n8n workflows"
- "Show me the details of workflow XYZ"
- "Create a new workflow that sends a Slack message when a webhook is received"
- "Activate the workflow named 'Daily Report'"
- "Deactivate all test workflows"

### Execution Monitoring

- "Show me the recent workflow executions"
- "Check the status of execution ABC123"
- "Get a summary of all executions for workflow XYZ"
- "Show me any failed executions from today"

### Credential Management

- "List all my credentials"
- "Create a new Slack credential"
- "Show me what credential types are available"

### Advanced Operations

- "Add an HTTP request node to workflow ABC that calls the GitHub API"
- "Update workflow XYZ to include error handling"
- "Show me the workflow execution statistics"

## Troubleshooting

### Common Issues

1. **MCP Server Not Loading**
   - Check that the path to `index.js` is correct
   - Ensure the project is built (`npm run build`)
   - Verify Node.js is in your PATH

2. **Authentication Errors**
   - Verify your n8n API key is correct
   - Check that your n8n instance is running
   - Ensure the API URL is correct

3. **Connection Issues**
   - Confirm n8n is accessible at the specified URL
   - Check firewall settings
   - Verify n8n API is enabled

### Debugging

To debug issues:

1. Check Claude Desktop logs
2. Test the MCP server directly:
   ```bash
   node dist/index.js
   ```
3. Verify n8n API connectivity:
   ```bash
   curl -H "X-N8N-API-KEY: your_key" http://localhost:5678/api/v1/workflows
   ```

## Security Notes

- Keep your n8n API key secure
- Don't commit API keys to version control
- Consider using environment variables for sensitive data
- Regularly rotate your API keys
- Limit API key permissions if possible

## Advanced Configuration

### Custom Node Types

You can extend the workflow creation capabilities by modifying the `parseDescriptionToNodes` function in `src/tools/workflow-tools.ts` to recognize additional keywords and node types.

### Rate Limiting

The server includes basic timeout settings. Adjust the `TIMEOUT` environment variable to control request timeouts.

### Logging

Set `LOG_LEVEL` to `debug` for more verbose logging during development.
