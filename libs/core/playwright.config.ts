import { defineConfig, devices } from '@playwright/test';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const isCoverage = process.env.COVERAGE === 'true';

export default defineConfig({
  testDir: './e2e',
  testMatch: '**/*.spec.ts',
  snapshotDir: './e2e/__snapshots__',
  snapshotPathTemplate: '{snapshotDir}/{testFilePath}/{arg}-{platform}{ext}',
  timeout: 30000,
  fullyParallel: !isCoverage,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: isCoverage ? 1 : (process.env.CI ? 1 : undefined),
  reporter: [
    ['html', { outputFolder: resolve(__dirname, 'playwright-report') }],
    process.env.CI ? ['github'] : ['list'],
  ],
  outputDir: resolve(__dirname, 'test-results'),
  
  globalSetup: isCoverage ? resolve(__dirname, 'e2e/global-setup.ts') : undefined,
  globalTeardown: isCoverage ? resolve(__dirname, 'e2e/global-teardown.ts') : undefined,

  expect: {
    toHaveScreenshot: {
      maxDiffPixelRatio: 0.01,
    },
  },

  use: {
    baseURL: 'http://localhost:4173',
    trace: 'on-first-retry',
    // Collect coverage after each test automatically
    contextOptions: {
      serviceWorkers: 'block',
    },
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  webServer: {
    command: isCoverage 
      ? 'COVERAGE=true npx vite --config libs/core/vite.e2e.config.ts --host 0.0.0.0'
      : 'npx vite --config libs/core/vite.e2e.config.ts --host 0.0.0.0',
    cwd: resolve(__dirname, '../..'),
    url: 'http://localhost:4173',
    reuseExistingServer: !process.env.CI && !isCoverage,
    timeout: 120000,
  },
});
