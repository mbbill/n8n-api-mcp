import { z } from 'zod';
import { N8nClient, N8nWorkflow, N8nNode } from '../lib/n8n-client.js';

export interface McpTool {
  name: string;
  description: string;
  inputSchema: z.ZodSchema;
  handler: (args: any) => Promise<any>;
}

export function createWorkflowTools(n8nClient: N8nClient): McpTool[] {
  return [
    {
      name: 'list_workflows',
      description: 'List all workflows in n8n instance with optional filtering',
      inputSchema: z.object({
        active: z.boolean().optional().describe('Filter by active status'),
        name: z.string().optional().describe('Filter by workflow name'),
        tags: z.string().optional().describe('Filter by tags (comma-separated)'),
        limit: z.number().optional().describe('Maximum number of workflows to return'),
      }),
      handler: async (args) => {
        const workflows = await n8nClient.getWorkflows({
          active: args.active,
          name: args.name,
          tags: args.tags,
          limit: args.limit,
        });

        return {
          success: true,
          data: workflows.data.map(workflow => ({
            id: workflow.id,
            name: workflow.name,
            active: workflow.active,
            createdAt: workflow.createdAt,
            updatedAt: workflow.updatedAt,
            nodesCount: workflow.nodes.length,
            tags: workflow.tags?.map(tag => tag.name) || [],
          })),
          nextCursor: workflows.nextCursor,
        };
      },
    },

    {
      name: 'get_workflow',
      description: 'Get detailed information about a specific workflow',
      inputSchema: z.object({
        id: z.string().describe('Workflow ID'),
        excludePinnedData: z.boolean().optional().describe('Exclude pinned test data'),
      }),
      handler: async (args) => {
        const workflow = await n8nClient.getWorkflow(args.id, args.excludePinnedData);

        return {
          success: true,
          data: {
            id: workflow.id,
            name: workflow.name,
            active: workflow.active,
            createdAt: workflow.createdAt,
            updatedAt: workflow.updatedAt,
            nodes: workflow.nodes.map(node => ({
              id: node.id,
              name: node.name,
              type: node.type,
              position: node.position,
            })),
            connections: workflow.connections,
            settings: workflow.settings,
            tags: workflow.tags?.map(tag => tag.name) || [],
          },
        };
      },
    },

    {
      name: 'create_workflow',
      description: 'Create a new workflow from natural language description',
      inputSchema: z.object({
        name: z.string().describe('Workflow name'),
        description: z.string().describe('Natural language description of what the workflow should do'),
        tags: z.array(z.string()).optional().describe('Tags to apply to the workflow'),
      }),
      handler: async (args) => {
        // Parse the description and create basic workflow structure
        const basicNodes = parseDescriptionToNodes(args.description);        const workflow: Omit<N8nWorkflow, 'id' | 'createdAt' | 'updatedAt'> = {
          name: args.name,
          nodes: basicNodes,
          connections: generateBasicConnections(basicNodes),
          settings: {
            executionOrder: 'v1',
            saveManualExecutions: true,
          },
        };

        const createdWorkflow = await n8nClient.createWorkflow(workflow);

        return {
          success: true,
          data: {
            id: createdWorkflow.id,
            name: createdWorkflow.name,
            message: `Created workflow "${createdWorkflow.name}" with ${basicNodes.length} nodes`,
            nodes: basicNodes.map(node => ({ id: node.id, name: node.name, type: node.type })),
          },
        };
      },
    },    {
      name: 'update_workflow',
      description: 'Update an existing workflow',
      inputSchema: z.object({
        id: z.string().describe('Workflow ID'),
        name: z.string().optional().describe('New workflow name'),
        active: z.boolean().optional().describe('Set workflow active status'),
        addNodes: z.array(z.object({
          type: z.string().describe('Node type (e.g., n8n-nodes-base.httpRequest)'),
          name: z.string().describe('Node display name'),
          parameters: z.record(z.any()).optional().describe('Node parameters'),
        })).optional().describe('Nodes to add to the workflow'),
        removeNodes: z.array(z.string()).optional().describe('Node names to remove from the workflow'),
      }),
      handler: async (args) => {
        const currentWorkflow = await n8nClient.getWorkflow(args.id);

        // Create a complete workflow object with all required fields
        const updatedWorkflow: N8nWorkflow = {
          ...currentWorkflow,
          name: args.name || currentWorkflow.name,
          active: args.active !== undefined ? args.active : currentWorkflow.active,
        };

        // Handle node removal
        if (args.removeNodes && args.removeNodes.length > 0) {
          updatedWorkflow.nodes = currentWorkflow.nodes.filter(
            node => !args.removeNodes!.includes(node.name)
          );
          
          // Update connections to remove references to deleted nodes
          const connections: Record<string, any> = {};
          Object.entries(currentWorkflow.connections).forEach(([nodeName, nodeConnections]) => {
            if (!args.removeNodes!.includes(nodeName)) {
              // Filter out connections to removed nodes
              const filteredConnections = { ...nodeConnections };
              if (filteredConnections.main) {
                filteredConnections.main = filteredConnections.main.map((connectionGroup: any[]) =>
                  connectionGroup.filter((conn: any) => !args.removeNodes!.includes(conn.node))
                );
              }
              connections[nodeName] = filteredConnections;
            }
          });
          updatedWorkflow.connections = connections;
        }

        // Handle node addition
        if (args.addNodes && args.addNodes.length > 0) {
          const newNodes: N8nNode[] = args.addNodes.map((nodeSpec: any, index: number) => ({
            id: generateNodeId(),
            name: nodeSpec.name,
            type: nodeSpec.type,
            typeVersion: 1,
            position: [200 + (index * 200), 200],
            parameters: nodeSpec.parameters || {},
          }));

          updatedWorkflow.nodes = [...updatedWorkflow.nodes, ...newNodes];
          
          // Generate basic connections for new nodes if needed
          if (updatedWorkflow.nodes.length > 1) {
            const existingConnections = updatedWorkflow.connections;
            updatedWorkflow.connections = generateBasicConnections(updatedWorkflow.nodes);
            // Preserve existing connections where possible
            Object.assign(updatedWorkflow.connections, existingConnections);
          }
        }

        const result = await n8nClient.updateWorkflow(args.id, updatedWorkflow);

        return {
          success: true,
          data: {
            id: result.id,
            name: result.name,
            active: result.active,
            message: 'Workflow updated successfully',
            nodesCount: result.nodes.length,
            removedNodes: args.removeNodes || [],
            addedNodes: args.addNodes?.map((n: any) => n.name) || [],
          },
        };
      },
    },

    {
      name: 'delete_workflow',
      description: 'Delete a workflow',
      inputSchema: z.object({
        id: z.string().describe('Workflow ID'),
        confirm: z.boolean().describe('Confirmation flag - must be true'),
      }),
      handler: async (args) => {
        if (!args.confirm) {
          throw new Error('Confirmation required. Set confirm=true to delete the workflow.');
        }

        const deletedWorkflow = await n8nClient.deleteWorkflow(args.id);

        return {
          success: true,
          data: {
            id: deletedWorkflow.id,
            name: deletedWorkflow.name,
            message: `Workflow "${deletedWorkflow.name}" deleted successfully`,
          },
        };
      },
    },

    {
      name: 'activate_workflow',
      description: 'Activate a workflow to make it run automatically',
      inputSchema: z.object({
        id: z.string().describe('Workflow ID'),
      }),
      handler: async (args) => {
        const workflow = await n8nClient.activateWorkflow(args.id);

        return {
          success: true,
          data: {
            id: workflow.id,
            name: workflow.name,
            active: workflow.active,
            message: `Workflow "${workflow.name}" activated successfully`,
          },
        };
      },
    },

    {
      name: 'deactivate_workflow',
      description: 'Deactivate a workflow to stop automatic execution',
      inputSchema: z.object({
        id: z.string().describe('Workflow ID'),
      }),
      handler: async (args) => {
        const workflow = await n8nClient.deactivateWorkflow(args.id);

        return {
          success: true,
          data: {
            id: workflow.id,
            name: workflow.name,
            active: workflow.active,
            message: `Workflow "${workflow.name}" deactivated successfully`,
          },
        };
      },
    },
  ];
}

// Helper functions
function parseDescriptionToNodes(description: string): N8nNode[] {
  const nodes: N8nNode[] = [];

  // Always start with a manual trigger
  nodes.push({
    id: generateNodeId(),
    name: 'Manual Trigger',
    type: 'n8n-nodes-base.manualTrigger',
    typeVersion: 1,
    position: [0, 200],
    parameters: {},
  });

  // Simple keyword-based node detection
  const keywordMap: Record<string, { type: string; name: string; params?: any }> = {
    'http': { type: 'n8n-nodes-base.httpRequest', name: 'HTTP Request' },
    'api': { type: 'n8n-nodes-base.httpRequest', name: 'API Request' },
    'webhook': { type: 'n8n-nodes-base.webhook', name: 'Webhook' },
    'email': { type: 'n8n-nodes-base.emailSend', name: 'Send Email' },
    'gmail': { type: 'n8n-nodes-base.gmail', name: 'Gmail' },
    'slack': { type: 'n8n-nodes-base.slack', name: 'Slack' },
    'discord': { type: 'n8n-nodes-base.discord', name: 'Discord' },
    'schedule': { type: 'n8n-nodes-base.cron', name: 'Schedule Trigger' },
    'cron': { type: 'n8n-nodes-base.cron', name: 'Cron Trigger' },
    'database': { type: 'n8n-nodes-base.postgres', name: 'Database' },
    'mysql': { type: 'n8n-nodes-base.mySql', name: 'MySQL' },
    'postgres': { type: 'n8n-nodes-base.postgres', name: 'PostgreSQL' },
    'file': { type: 'n8n-nodes-base.readBinaryFile', name: 'Read File' },
    'json': { type: 'n8n-nodes-base.set', name: 'Set Data' },
    'filter': { type: 'n8n-nodes-base.filter', name: 'Filter' },
    'condition': { type: 'n8n-nodes-base.if', name: 'IF Condition' },
  };

  const lowerDesc = description.toLowerCase();
  let nodeIndex = 1;

  for (const [keyword, nodeSpec] of Object.entries(keywordMap)) {
    if (lowerDesc.includes(keyword)) {
      nodes.push({
        id: generateNodeId(),
        name: nodeSpec.name,
        type: nodeSpec.type,
        typeVersion: 1,
        position: [200 * nodeIndex, 200],
        parameters: nodeSpec.params || {},
      });
      nodeIndex++;
    }
  }

  // If no specific nodes were detected, add a basic HTTP request node
  if (nodes.length === 1) {
    nodes.push({
      id: generateNodeId(),
      name: 'HTTP Request',
      type: 'n8n-nodes-base.httpRequest',
      typeVersion: 1,
      position: [200, 200],
      parameters: {},
    });
  }

  return nodes;
}

function generateBasicConnections(nodes: N8nNode[]): Record<string, any> {
  const connections: Record<string, any> = {};

  for (let i = 0; i < nodes.length - 1; i++) {
    const currentNode = nodes[i];
    const nextNode = nodes[i + 1];

    connections[currentNode.name] = {
      main: [[{ node: nextNode.name, type: 'main', index: 0 }]],
    };
  }

  return connections;
}

function generateNodeId(): string {
  return Math.random().toString(36).substring(2, 15) +
         Math.random().toString(36).substring(2, 15);
}
