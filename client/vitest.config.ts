import path from 'path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    setupFiles: './setupTests.ts',
    environment: 'jsdom',
    globals: true,
  },
  resolve: {
    alias: {
      '~': path.resolve(__dirname, 'src'),
      'styled-system': path.resolve(__dirname, 'styled-system'),
    },
  },
});