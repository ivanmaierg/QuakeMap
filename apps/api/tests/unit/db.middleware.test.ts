import { describe, expect, it } from 'vitest';
import { createDatabase, getDatabase } from '../../src/middleware/db.middleware';

describe('Database Middleware', () => {
  describe('createDatabase', () => {
    it.skip('should create a database instance with correct schema', () => {
      const databaseUrl = process.env.DATABASE_URL || 'postgresql://test:test@localhost:5432/test';
      
      const db = createDatabase(databaseUrl);
      
      expect(db).toBeDefined();
      expect(db.query).toBeDefined();
      expect(db.query.earthquakes).toBeDefined();
    });

    it('should throw error for invalid database URL', () => {
      expect(() => {
        createDatabase('invalid-url');
      }).toThrow();
    });
  });

  describe('getDatabase', () => {
    it('should create database from context env', () => {
      const mockContext = {
        env: {
          DATABASE_URL: 'postgresql://test:test@localhost:5432/test'
        }
      };
      
      const db = getDatabase(mockContext);
      
      expect(db).toBeDefined();
      expect(db.query).toBeDefined();
    });

    it('should create database from process env when context env is not available', () => {
      const originalEnv = process.env.DATABASE_URL;
      process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/test';
      
      const mockContext = {
        env: {}
      };
      
      const db = getDatabase(mockContext);
      
      expect(db).toBeDefined();
      expect(db.query).toBeDefined();
      
      // Restore original env
      process.env.DATABASE_URL = originalEnv;
    });

    it('should throw error when no DATABASE_URL is available', () => {
      const originalEnv = process.env.DATABASE_URL;
      delete process.env.DATABASE_URL;
      
      const mockContext = {
        env: {}
      };
      
      expect(() => {
        getDatabase(mockContext);
      }).toThrow('DATABASE_URL environment variable is required');
      
      // Restore original env
      process.env.DATABASE_URL = originalEnv;
    });
  });
});
