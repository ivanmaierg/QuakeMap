// Test setup file
import dotenv from 'dotenv';

// Load test environment variables
dotenv.config({ path: '.test.vars' });

// Set default test environment variables if not present
process.env.DATABASE_URL = process.env.DATABASE_URL || 'postgresql://test:test@localhost:5432/testdb';
process.env.ENVIRONMENT = process.env.ENVIRONMENT || 'test';
process.env.PROJECT_NAME = process.env.PROJECT_NAME || 'QuakeMap API Test';
process.env.CORS_ORIGINS = process.env.CORS_ORIGINS || 'http://localhost:3000';
process.env.BASE_URL = process.env.BASE_URL || 'http://localhost:8787';
