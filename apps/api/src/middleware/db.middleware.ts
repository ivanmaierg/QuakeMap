import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { earthquakes } from '@quake-map/db';

export type Database = ReturnType<typeof drizzle<{ earthquakes: typeof earthquakes }>>;

// Create a fresh database connection for each request
export const createDatabase = (databaseUrl: string): Database => {
  const client = postgres(databaseUrl, {
    max: 1, // Single connection for Cloudflare Workers
    idle_timeout: 20,
    connect_timeout: 10,
    ssl: 'require' // Required for Neon
  });
  
  return drizzle(client, { 
    schema: { earthquakes },
    logger: process.env.NODE_ENV !== 'production'
  });
};

// Helper function to get database from context or create new one
export const getDatabase = (c: any): Database => {
  const databaseUrl = c.env?.DATABASE_URL || process.env.DATABASE_URL;
  
  if (!databaseUrl) {
    throw new Error('DATABASE_URL environment variable is required');
  }

  return createDatabase(databaseUrl);
};
