import { defineConfig } from 'vite';
import istanbul from 'vite-plugin-istanbul';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const isCoverage = process.env.COVERAGE === 'true';

export default defineConfig({
  root: resolve(__dirname, 'e2e'),
  resolve: {
    alias: {
      '@ghentcdh/annotated-text': resolve(__dirname, 'src/index.ts'),
    },
  },
  plugins: isCoverage ? [
    istanbul({
      include: ['src/**/*'],
      exclude: ['node_modules', 'e2e/**/*', '**/*.spec.ts', '**/*.test.ts'],
      extension: ['.ts', '.js'],
      requireEnv: false,
      forceBuildInstrument: true,
      cwd: __dirname,
    }),
  ] : [],
  server: {
    port: 4173,
    host: '0.0.0.0',
    strictPort: true,
  },
  preview: {
    port: 4173,
    host: '0.0.0.0',
  },
});
