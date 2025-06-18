import { N8nClient } from '../lib/n8n-client.js';

export interface McpResource {
  uri: string;
  name: string;
  description?: string;
  mimeType?: string;
}

export interface McpResourceContent {
  contents: Array<{
    type: 'text' | 'blob';
    text?: string;
    blob?: string;
  }>;
}

export function createResourceHandlers(n8nClient: N8nClient) {
  return {
    listResources(): McpResource[] {
      return [
        {
          uri: 'n8n://workflows',
          name: 'Workflows',
          description: 'List of all workflows in the n8n instance',
          mimeType: 'application/json',
        },
        {
          uri: 'n8n://executions',
          name: 'Recent Executions',
          description: 'Recent workflow executions',
          mimeType: 'application/json',
        },
        {
          uri: 'n8n://credentials',
          name: 'Credentials',
          description: 'List of configured credentials (data excluded)',
          mimeType: 'application/json',
        },
        {
          uri: 'n8n://status',
          name: 'Instance Status',
          description: 'Overview of the n8n instance status',
          mimeType: 'application/json',
        },
      ];
    },

    async readResource(uri: string): Promise<McpResourceContent> {
      try {
        switch (uri) {
          case 'n8n://workflows': {
            const workflows = await n8nClient.getWorkflows({ limit: 50 });
            const workflowSummary = workflows.data.map(workflow => ({
              id: workflow.id,
              name: workflow.name,
              active: workflow.active,
              createdAt: workflow.createdAt,
              updatedAt: workflow.updatedAt,
              nodesCount: workflow.nodes.length,
              tags: workflow.tags?.map(tag => tag.name) || [],
            }));

            return {
              contents: [
                {
                  type: 'text',
                  text: JSON.stringify({
                    total: workflows.data.length,
                    workflows: workflowSummary,
                    nextCursor: workflows.nextCursor,
                  }, null, 2),
                },
              ],
            };
          }

          case 'n8n://executions': {
            const executions = await n8nClient.getExecutions({ limit: 20 });
            const executionSummary = executions.data.map(execution => ({
              id: execution.id,
              workflowId: execution.workflowId,
              workflowName: execution.workflowData.name,
              mode: execution.mode,
              finished: execution.finished,
              startedAt: execution.startedAt,
              stoppedAt: execution.stoppedAt,
            }));

            return {
              contents: [
                {
                  type: 'text',
                  text: JSON.stringify({
                    total: executions.data.length,
                    executions: executionSummary,
                    nextCursor: executions.nextCursor,
                  }, null, 2),
                },
              ],
            };
          }          case 'n8n://credentials': {
            // Note: Credentials listing is not supported by n8n API for security reasons
            return {
              contents: [
                {
                  type: 'text',
                  text: JSON.stringify({
                    message: 'Credential listing is not supported by n8n API for security reasons',
                    availableOperations: ['create_credential', 'delete_credential', 'get_credential_types'],
                  }, null, 2),
                },
              ],
            };
          }          case 'n8n://status': {
            // Get overview status by fetching basic info
            try {
              const [workflows, executions] = await Promise.all([
                n8nClient.getWorkflows({ limit: 1 }),
                n8nClient.getExecutions({ limit: 10 }),
              ]);

              const activeWorkflows = workflows.data.filter((w: any) => w.active).length;
              const recentExecutions = executions.data.length;

              // Simple status based on recent activity
              const hasRecentActivity = executions.data.some((exec: any) => {
                const startedAt = new Date(exec.startedAt);
                const now = new Date();
                const hoursDiff = (now.getTime() - startedAt.getTime()) / (1000 * 60 * 60);
                return hoursDiff < 24;
              });              const status = {
                healthy: true,
                activeWorkflows,
                recentExecutions,
                hasRecentActivity,
                lastCheck: new Date().toISOString(),
              };

              return {
                contents: [
                  {
                    type: 'text',
                    text: JSON.stringify(status, null, 2),
                  },
                ],
              };
            } catch (error) {
              return {
                contents: [
                  {
                    type: 'text',
                    text: JSON.stringify({
                      healthy: false,
                      error: error instanceof Error ? error.message : 'Unknown error',
                      lastCheck: new Date().toISOString(),
                    }, null, 2),
                  },
                ],
              };
            }
          }

          default:
            throw new Error(`Unknown resource URI: ${uri}`);
        }
      } catch (error) {
        throw new Error(`Failed to read resource ${uri}: ${error instanceof Error ? error.message : String(error)}`);
      }
    },
  };
}
