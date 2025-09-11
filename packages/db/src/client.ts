import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

// Create a function to get a fresh database connection for each request
// This is the recommended pattern for Cloudflare Workers
export const getDb = (connectionString: string) => {
  if (!connectionString) {
    throw new Error('DATABASE_URL or NEON_DATABASE_URL environment variable is required');
  }

  const client = postgres(connectionString, {
    max: 1, // Use single connection per request for Cloudflare Workers
    idle_timeout: 20,
    connect_timeout: 10
  });
  
  return drizzle(client, { schema });
};

// For backward compatibility in non-Cloudflare environments
export const createDbFromEnv = () => {
  const connectionString = process.env.DATABASE_URL || process.env.NEON_DATABASE_URL;
  
  if (!connectionString) {
    throw new Error('DATABASE_URL or NEON_DATABASE_URL environment variable is required');
  }

  return getDb(connectionString);
};

// Legacy export for backward compatibility - only use in non-Cloudflare environments
let _defaultDb: ReturnType<typeof getDb> | null = null;

export const db = new Proxy({} as ReturnType<typeof getDb>, {
  get(_target, prop) {
    if (!_defaultDb) {
      _defaultDb = createDbFromEnv();
    }
    return (_defaultDb as any)[prop];
  }
});

export type Database = ReturnType<typeof getDb>;
