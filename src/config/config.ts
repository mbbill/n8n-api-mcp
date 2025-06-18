import { z } from 'zod';

const configSchema = z.object({
  n8nApiUrl: z.string().url(),
  n8nApiKey: z.string().min(1),
  logLevel: z.enum(['debug', 'info', 'warn', 'error']).default('info'),
  timeout: z.number().default(30000),
});

function loadConfig() {
  const n8nApiUrl = process.env.N8N_API_URL;
  const n8nApiKey = process.env.N8N_API_KEY;
  const logLevel = process.env.LOG_LEVEL;
  const timeout = process.env.TIMEOUT;

  if (!n8nApiUrl) {
    throw new Error('N8N_API_URL environment variable is required');
  }

  if (!n8nApiKey) {
    throw new Error('N8N_API_KEY environment variable is required');
  }

  return configSchema.parse({
    n8nApiUrl,
    n8nApiKey,
    logLevel,
    timeout: timeout ? parseInt(timeout, 10) : undefined,
  });
}

export const config = loadConfig();
export type Config = z.infer<typeof configSchema>;
