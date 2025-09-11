/// <reference types="vitest" />
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['src/**/*.test.ts', 'tests/**/*.test.ts'],
    globals: true,
    environment: 'node',
    setupFiles: ['./tests/setup.ts'],
    testTimeout: 5000,
    hookTimeout: 5000,
    exclude: [
      'tests/integration/earthquakes.get.test.ts',
      'tests/unit/earthquake.queries.test.ts'
    ],
  },
  resolve: {
    alias: {
      '@': '/src',
    },
  },
});
