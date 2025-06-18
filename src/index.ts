#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ListResourcesRequestSchema,
  ReadResourceRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { N8nClient } from './lib/n8n-client.js';
import { createWorkflowTools } from './tools/workflow-tools.js';
import { createExecutionTools } from './tools/execution-tools.js';
import { createCredentialTools } from './tools/credential-tools.js';
import { createResourceHandlers } from './resources/resource-handlers.js';
import { config } from './config/config.js';

async function main() {
  const server = new Server(
    {
      name: 'n8n-mcp-server',
      version: '1.0.0',
    },
    {
      capabilities: {
        tools: {},
        resources: {},
      },
    }
  );

  // Initialize n8n client
  const n8nClient = new N8nClient({
    apiUrl: config.n8nApiUrl,
    apiKey: config.n8nApiKey,
  });

  // Create tool handlers
  const workflowTools = createWorkflowTools(n8nClient);
  const executionTools = createExecutionTools(n8nClient);
  const credentialTools = createCredentialTools(n8nClient);

  // Create resource handlers
  const resourceHandlers = createResourceHandlers(n8nClient);

  // Combine all tools
  const allTools = [
    ...workflowTools,
    ...executionTools,
    ...credentialTools,
  ];

  // Register tool handlers
  server.setRequestHandler(ListToolsRequestSchema, async () => {
    return {
      tools: allTools.map(tool => ({
        name: tool.name,
        description: tool.description,
        inputSchema: tool.inputSchema,
      })),
    };
  });

  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;

    const tool = allTools.find(t => t.name === name);
    if (!tool) {
      throw new Error(`Unknown tool: ${name}`);
    }

    try {
      const result = await tool.handler(args || {});
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(result, null, 2),
          },
        ],
      };
    } catch (error) {
      throw new Error(`Tool execution failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  });

  // Register resource handlers
  server.setRequestHandler(ListResourcesRequestSchema, async () => {
    return {
      resources: resourceHandlers.listResources(),
    };
  });  server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
    const { uri } = request.params;
    const result = await resourceHandlers.readResource(uri);
    return {
      contents: result.contents,
    };
  });

  // Start the server
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('n8n MCP Server running on stdio');
}

main().catch((error) => {
  console.error('Server error:', error);
  process.exit(1);
});
