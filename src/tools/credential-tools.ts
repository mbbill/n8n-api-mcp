import { z } from 'zod';
import { N8nClient, N8nCredential } from '../lib/n8n-client.js';
import { McpTool } from './workflow-tools.js';

export function createCredentialTools(n8nClient: N8nClient): McpTool[] {
  return [
    {
      name: 'get_credential_types',
      description: 'Get information about available credential types',
      inputSchema: z.object({}),
      handler: async () => {
        // This is a static list of common n8n credential types
        // In a real implementation, this could be fetched from n8n API if available
        const credentialTypes = [
          {
            type: 'httpBasicAuth',
            name: 'HTTP Basic Auth',
            description: 'Basic authentication with username and password',
            fields: ['user', 'password'],
          },
          {
            type: 'httpHeaderAuth',
            name: 'HTTP Header Auth',
            description: 'Authentication using custom HTTP headers',
            fields: ['name', 'value'],
          },
          {
            type: 'apiKey',
            name: 'API Key',
            description: 'API key authentication',
            fields: ['apiKey'],
          },
          {
            type: 'oauth2',
            name: 'OAuth2',
            description: 'OAuth 2.0 authentication',
            fields: ['clientId', 'clientSecret', 'accessToken', 'refreshToken'],
          },
          {
            type: 'googleOAuth2',
            name: 'Google OAuth2',
            description: 'Google OAuth 2.0 authentication',
            fields: ['clientId', 'clientSecret', 'accessToken', 'refreshToken'],
          },
          {
            type: 'slackOAuth2',
            name: 'Slack OAuth2',
            description: 'Slack OAuth 2.0 authentication',
            fields: ['clientId', 'clientSecret', 'accessToken'],
          },
          {
            type: 'githubOAuth2',
            name: 'GitHub OAuth2',
            description: 'GitHub OAuth 2.0 authentication',
            fields: ['clientId', 'clientSecret', 'accessToken'],
          },
          {
            type: 'aws',
            name: 'AWS',
            description: 'Amazon Web Services authentication',
            fields: ['accessKeyId', 'secretAccessKey', 'region'],
          },
        ];

        return {
          success: true,
          data: credentialTypes,
        };
      },
    },

    {
      name: 'create_credential',
      description: 'Create a new credential',
      inputSchema: z.object({
        name: z.string().describe('Credential name'),
        type: z.string().describe('Credential type (e.g., httpBasicAuth, apiKey, oauth2)'),
        data: z.record(z.any()).describe('Credential data (API keys, tokens, etc.)'),
      }),
      handler: async (args) => {
        const credential: Omit<N8nCredential, 'id' | 'createdAt' | 'updatedAt'> = {
          name: args.name,
          type: args.type,
          data: args.data,
        };

        const createdCredential = await n8nClient.createCredential(credential);

        return {
          success: true,
          data: {
            id: createdCredential.id,
            name: createdCredential.name,
            type: createdCredential.type,
            message: `Credential "${createdCredential.name}" created successfully`,
          },
        };
      },
    },

    {
      name: 'delete_credential',
      description: 'Delete a credential',
      inputSchema: z.object({
        id: z.string().describe('Credential ID'),
        confirm: z.boolean().describe('Confirmation flag - must be true'),
      }),
      handler: async (args) => {
        if (!args.confirm) {
          throw new Error('Confirmation required. Set confirm=true to delete the credential.');
        }

        const deletedCredential = await n8nClient.deleteCredential(args.id);

        return {
          success: true,
          data: {
            id: deletedCredential.id,
            name: deletedCredential.name,
            message: `Credential "${deletedCredential.name}" deleted successfully`,
          },
        };
      },
    },
  ];
}
