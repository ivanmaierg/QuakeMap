import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

const connectionString = process.env.DATABASE_URL || process.env.NEON_DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL or NEON_DATABASE_URL environment variable is required');
}

// Create a function to get a fresh database connection for each request
export const getDb = () => {
  const client = postgres(connectionString, {
    max: 1, // Use single connection per request for Cloudflare Workers
    idle_timeout: 20,
    connect_timeout: 10
  });
  
  return drizzle(client, { schema });
};

// For backward compatibility, create a default instance
// But this should be avoided in Cloudflare Workers
const defaultClient = postgres(connectionString, {
  max: 1,
  idle_timeout: 20,
  connect_timeout: 10
});

export const db = drizzle(defaultClient, { schema });

export type Database = typeof db;
