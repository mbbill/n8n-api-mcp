# n8n MCP Server

A Model Context Protocol (MCP) server that enables AI chatbots to interact with n8n workflow automation platform.

## 🎯 Overview

This MCP server provides comprehensive tools for managing, editing, and executing n8n workflows through natural language commands. It can be integrated with Claude Desktop and other MCP-compatible AI tools to give you AI-powered workflow management capabilities.

## ✨ Features

- **🔄 Workflow Management**: List, create, update, and delete workflows
- **🛠️ Workflow Editing**: Add nodes, modify configurations, and handle connections
- **▶️ Execution Management**: Trigger executions and monitor results
- **🔐 Credential Management**: Manage API keys and authentication credentials
- **📊 Resource Access**: Get real-time status and data through MCP resources
- **🛡️ Security**: Secure API key authentication and validation

## 🚀 Available AI Tools

### Workflow Tools
- `list_workflows` - List workflows with filtering options
- `get_workflow` - Get detailed workflow information
- `create_workflow` - Create workflows from natural language descriptions
- `update_workflow` - Update workflows and add new nodes
- `delete_workflow` - Delete workflows with confirmation
- `activate_workflow` / `deactivate_workflow` - Control workflow execution

### Execution Tools
- `list_executions` - List executions with status filtering
- `get_execution` - Get detailed execution information
- `get_workflow_executions` - Get executions for specific workflows
- `get_execution_summary` - Get execution statistics
- `delete_execution` - Delete execution records

### Credential Tools
- `list_credentials` - List configured credentials
- `create_credential` - Create new credentials
- `update_credential` - Update existing credentials
- `delete_credential` - Delete credentials
- `get_credential_types` - List available credential types

## 🔧 Setup

### Prerequisites

- Node.js 18+
- n8n instance with API access
- n8n API key

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file from the template:
   ```powershell
   Copy-Item .env.example .env
   ```

4. Edit `.env` and set your n8n details:
   ```env
   N8N_API_URL=http://localhost:5678/api/v1
   N8N_API_KEY=your_api_key_here
   ```

5. Build the project:
   ```powershell
   npm run build
   ```

6. Test the server:
   ```powershell
   .\test-server.ps1
   ```

### Claude Desktop Integration

Add this configuration to your Claude Desktop config file:
(`%APPDATA%\Claude\claude_desktop_config.json` on Windows)

```json
{
  "mcpServers": {
    "n8n": {
      "command": "node",
      "args": ["D:\\path\\to\\n8n-api-mcp\\dist\\index.js"],
      "env": {
        "N8N_API_URL": "http://localhost:5678/api/v1",
        "N8N_API_KEY": "your_api_key_here"
      }
    }
  }
}
```

After updating the config, restart Claude Desktop.

## 💬 Usage Examples

Once configured, you can use natural language commands in Claude Desktop:

- *"List my n8n workflows"*
- *"Create a workflow that sends an email when I get a webhook"*
- *"Show me recent executions for my data sync workflow"*
- *"Add a Slack notification to workflow ID abc123"*
- *"What credentials are configured?"*
- *"Activate the Daily Reports workflow"*

## 🧪 Development

- `npm run dev` - Start development server with watch mode
- `npm run test` - Run tests
- `npm run lint` - Lint code
- `npm run type-check` - Type check without emitting

## 📚 Documentation

- `docs/claude-desktop-setup.md` - Detailed setup instructions
- `PROJECT-SUMMARY.md` - Complete project overview
- `test-server.ps1` - PowerShell setup verification script

## 🛠️ Built With

- **TypeScript** - Type-safe development
- **MCP SDK** - Model Context Protocol implementation
- **Axios** - HTTP client for n8n API
- **Zod** - Runtime type validation
- **Vitest** - Fast unit testing

## 📋 Requirements

- Node.js 18+
- n8n instance with API access
- n8n API key (generate in n8n Settings > API Keys)

## License

MIT
