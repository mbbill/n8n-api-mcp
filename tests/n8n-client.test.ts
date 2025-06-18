import { describe, it, expect, vi } from 'vitest';
import { N8nClient } from '../src/lib/n8n-client.js';

// Mock axios
vi.mock('axios', () => ({
  default: {
    create: vi.fn(() => ({
      get: vi.fn(),
      post: vi.fn(),
      put: vi.fn(),
      delete: vi.fn(),
      interceptors: {
        response: {
          use: vi.fn(),
        },
      },
    })),
  },
}));

describe('N8nClient', () => {
  it('should create a client with proper configuration', () => {
    const client = new N8nClient({
      apiUrl: 'http://localhost:5678/api/v1',
      apiKey: 'test-api-key',
    });

    expect(client).toBeInstanceOf(N8nClient);
  });

  it('should handle API errors properly', async () => {
    const client = new N8nClient({
      apiUrl: 'http://localhost:5678/api/v1',
      apiKey: 'test-api-key',
    });

    // Mock a failed request
    const mockAxios = client['axios'];
    mockAxios.get = vi.fn().mockRejectedValue(new Error('Network error'));

    await expect(client.getWorkflows()).rejects.toThrow('Network error');
  });
});
