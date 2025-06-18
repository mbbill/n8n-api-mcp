import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { z } from 'zod';

// Type definitions based on the OpenAPI spec
export interface N8nWorkflow {
  id?: string;
  name: string;
  active?: boolean;
  createdAt?: string;
  updatedAt?: string;
  nodes: N8nNode[];
  connections: Record<string, any>;
  settings: N8nWorkflowSettings;
  staticData?: any;
  tags?: N8nTag[];
}

export interface N8nNode {
  id: string;
  name: string;
  type: string;
  typeVersion: number;
  position: [number, number];
  parameters: Record<string, any>;
}

export interface N8nWorkflowSettings {
  executionOrder?: 'v0' | 'v1';
  saveManualExecutions?: boolean;
  callerPolicy?: string;
  errorWorkflow?: string;
  timezone?: string;
}

export interface N8nTag {
  id: string;
  name: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface N8nExecution {
  id: string;
  mode: string;
  finished: boolean;
  retryOf?: string;
  retrySuccessId?: string;
  startedAt: string;
  stoppedAt?: string;
  workflowData: N8nWorkflow;
  workflowId: string;
}

export interface N8nCredential {
  id?: string;
  name: string;
  type: string;
  data: Record<string, any>;
  createdAt?: string;
  updatedAt?: string;
}

export interface N8nClientConfig {
  apiUrl: string;
  apiKey: string;
  timeout?: number;
}

export class N8nClient {
  private axios: AxiosInstance;

  constructor(config: N8nClientConfig) {
    this.axios = axios.create({
      baseURL: config.apiUrl,
      timeout: config.timeout || 30000,
      headers: {
        'X-N8N-API-KEY': config.apiKey,
        'Content-Type': 'application/json',
      },
    });

    // Add response interceptor for error handling
    this.axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.data?.message) {
          throw new Error(`n8n API Error: ${error.response.data.message}`);
        }
        throw new Error(`n8n API Error: ${error.message}`);
      }
    );
  }

  // Workflow operations
  async getWorkflows(params?: {
    active?: boolean;
    tags?: string;
    name?: string;
    projectId?: string;
    excludePinnedData?: boolean;
    limit?: number;
    cursor?: string;
  }): Promise<{ data: N8nWorkflow[]; nextCursor?: string }> {
    const response = await this.axios.get('/workflows', { params });
    return response.data;
  }

  async getWorkflow(id: string, excludePinnedData?: boolean): Promise<N8nWorkflow> {
    const response = await this.axios.get(`/workflows/${id}`, {
      params: { excludePinnedData },
    });
    return response.data;
  }  async createWorkflow(workflow: Omit<N8nWorkflow, 'id' | 'createdAt' | 'updatedAt'>): Promise<N8nWorkflow> {
    // Remove read-only fields before sending to API
    const { active, tags, ...workflowData } = workflow;
    
    // Ensure only the required fields are sent
    const cleanWorkflow = {
      name: workflowData.name,
      nodes: workflowData.nodes || [],
      connections: workflowData.connections || {},
      settings: workflowData.settings || { executionOrder: 'v1' },
      ...(workflowData.staticData && { staticData: workflowData.staticData })
    };
    
    const response = await this.axios.post('/workflows', cleanWorkflow);
    return response.data;
  }  async updateWorkflow(id: string, workflow: N8nWorkflow): Promise<N8nWorkflow> {
    // Remove read-only fields before sending to API
    const { id: workflowId, createdAt, updatedAt, tags, active, ...workflowData } = workflow;
    
    // Ensure only the required fields are sent
    const cleanWorkflow = {
      name: workflowData.name,
      nodes: workflowData.nodes || [],
      connections: workflowData.connections || {},
      settings: workflowData.settings || { executionOrder: 'v1' },
      ...(workflowData.staticData && { staticData: workflowData.staticData })
    };
    
    const response = await this.axios.put(`/workflows/${id}`, cleanWorkflow);
    return response.data;
  }

  async deleteWorkflow(id: string): Promise<N8nWorkflow> {
    const response = await this.axios.delete(`/workflows/${id}`);
    return response.data;
  }

  async activateWorkflow(id: string): Promise<N8nWorkflow> {
    const response = await this.axios.post(`/workflows/${id}/activate`);
    return response.data;
  }

  async deactivateWorkflow(id: string): Promise<N8nWorkflow> {
    const response = await this.axios.post(`/workflows/${id}/deactivate`);
    return response.data;
  }

  // Execution operations
  async getExecutions(params?: {
    workflowId?: string;
    status?: 'error' | 'new' | 'running' | 'success' | 'waiting';
    includeData?: boolean;
    limit?: number;
    cursor?: string;
  }): Promise<{ data: N8nExecution[]; nextCursor?: string }> {
    const response = await this.axios.get('/executions', { params });
    return response.data;
  }

  async getExecution(id: string, includeData?: boolean): Promise<N8nExecution> {
    const response = await this.axios.get(`/executions/${id}`, {
      params: { includeData },
    });
    return response.data;
  }

  async deleteExecution(id: string): Promise<void> {
    await this.axios.delete(`/executions/${id}`);
  }
  // Credential operations
  async createCredential(credential: Omit<N8nCredential, 'id' | 'createdAt' | 'updatedAt'>): Promise<N8nCredential> {
    const response = await this.axios.post('/credentials', credential);
    return response.data;
  }

  async deleteCredential(id: string): Promise<N8nCredential> {
    const response = await this.axios.delete(`/credentials/${id}`);
    return response.data;
  }

  // Tag operations
  async getTags(): Promise<N8nTag[]> {
    const response = await this.axios.get('/tags');
    return response.data.data;
  }

  async createTag(name: string): Promise<N8nTag> {
    const response = await this.axios.post('/tags', { name });
    return response.data;
  }

  async updateTag(id: string, name: string): Promise<N8nTag> {
    const response = await this.axios.put(`/tags/${id}`, { name });
    return response.data;
  }

  async deleteTag(id: string): Promise<void> {
    await this.axios.delete(`/tags/${id}`);
  }
}
