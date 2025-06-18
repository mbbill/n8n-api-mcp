import { z } from 'zod';
import { N8nClient } from '../lib/n8n-client.js';
import { McpTool } from './workflow-tools.js';

export function createExecutionTools(n8nClient: N8nClient): McpTool[] {
  return [
    {
      name: 'list_executions',
      description: 'List workflow executions with optional filtering',
      inputSchema: z.object({
        workflowId: z.string().optional().describe('Filter by workflow ID'),
        status: z.enum(['error', 'new', 'running', 'success', 'waiting']).optional().describe('Filter by execution status'),
        includeData: z.boolean().optional().describe('Include execution data in response'),
        limit: z.number().optional().describe('Maximum number of executions to return'),
      }),
      handler: async (args) => {
        const executions = await n8nClient.getExecutions({
          workflowId: args.workflowId,
          status: args.status,
          includeData: args.includeData,
          limit: args.limit,
        });        return {
          success: true,
          data: executions.data.map(execution => ({
            id: execution.id,
            workflowId: execution.workflowId,
            mode: execution.mode,
            finished: execution.finished,
            startedAt: execution.startedAt,
            stoppedAt: execution.stoppedAt,
            workflowName: execution.workflowData?.name || 'Unknown',
            retryOf: execution.retryOf,
            retrySuccessId: execution.retrySuccessId,
          })),
          nextCursor: executions.nextCursor,
        };
      },
    },

    {
      name: 'get_execution',
      description: 'Get detailed information about a specific execution',
      inputSchema: z.object({
        id: z.string().describe('Execution ID'),
        includeData: z.boolean().optional().describe('Include execution data and outputs'),
      }),
      handler: async (args) => {
        const execution = await n8nClient.getExecution(args.id, args.includeData);

        return {
          success: true,          data: {
            id: execution.id,
            workflowId: execution.workflowId,
            workflowName: execution.workflowData?.name || 'Unknown',
            mode: execution.mode,
            finished: execution.finished,
            startedAt: execution.startedAt,
            stoppedAt: execution.stoppedAt,
            retryOf: execution.retryOf,
            retrySuccessId: execution.retrySuccessId,
            nodeExecutions: execution.workflowData?.nodes?.map(node => ({
              id: node.id,
              name: node.name,
              type: node.type,
            })) || [],
          },
        };
      },
    },

    {
      name: 'delete_execution',
      description: 'Delete an execution record',
      inputSchema: z.object({
        id: z.string().describe('Execution ID'),
        confirm: z.boolean().describe('Confirmation flag - must be true'),
      }),
      handler: async (args) => {
        if (!args.confirm) {
          throw new Error('Confirmation required. Set confirm=true to delete the execution.');
        }

        await n8nClient.deleteExecution(args.id);

        return {
          success: true,
          data: {
            id: args.id,
            message: `Execution ${args.id} deleted successfully`,
          },
        };
      },
    },

    {
      name: 'get_workflow_executions',
      description: 'Get all executions for a specific workflow',
      inputSchema: z.object({
        workflowId: z.string().describe('Workflow ID'),
        status: z.enum(['error', 'new', 'running', 'success', 'waiting']).optional().describe('Filter by execution status'),
        limit: z.number().optional().describe('Maximum number of executions to return'),
      }),
      handler: async (args) => {
        const executions = await n8nClient.getExecutions({
          workflowId: args.workflowId,
          status: args.status,
          limit: args.limit,
        });

        return {
          success: true,
          data: {
            workflowId: args.workflowId,
            executions: executions.data.map(execution => ({
              id: execution.id,
              mode: execution.mode,
              finished: execution.finished,
              startedAt: execution.startedAt,
              stoppedAt: execution.stoppedAt,
              retryOf: execution.retryOf,
              retrySuccessId: execution.retrySuccessId,
            })),
            totalExecutions: executions.data.length,
            nextCursor: executions.nextCursor,
          },
        };
      },
    },

    {
      name: 'get_execution_summary',
      description: 'Get a summary of executions grouped by status',
      inputSchema: z.object({
        workflowId: z.string().optional().describe('Filter by specific workflow ID'),
        limit: z.number().optional().describe('Maximum number of executions to analyze'),
      }),
      handler: async (args) => {
        const executions = await n8nClient.getExecutions({
          workflowId: args.workflowId,
          limit: args.limit || 100,
        });

        const summary = {
          total: executions.data.length,
          byStatus: {
            success: 0,
            error: 0,
            running: 0,
            waiting: 0,
            new: 0,
          },          recent: executions.data.slice(0, 5).map(execution => ({
            id: execution.id,
            workflowName: execution.workflowData?.name || 'Unknown',
            finished: execution.finished,
            startedAt: execution.startedAt,
            mode: execution.mode,
          })),
        };

        // Count executions by status (simplified logic)
        executions.data.forEach(execution => {
          if (execution.finished) {
            // Assume finished executions are successful unless we have better status info
            summary.byStatus.success++;
          } else {
            summary.byStatus.running++;
          }
        });

        return {
          success: true,
          data: summary,
        };
      },
    },
  ];
}
