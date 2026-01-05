import { test as base, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const istanbulCLIOutput = path.resolve(__dirname, '..', 'coverage', 'e2e', '.nyc_output');
const isCoverage = process.env.COVERAGE === 'true';

// Extend the base test to collect coverage
export const test = base.extend({
  page: async ({ page }, use, testInfo) => {
    // Use the page normally
    await use(page);

    // After test, collect coverage if enabled
    if (isCoverage) {
      try {
        const coverage = await page.evaluate(() => {
          return (window as any).__coverage__;
        });

        if (coverage) {
          // Ensure directory exists
          if (!fs.existsSync(istanbulCLIOutput)) {
            fs.mkdirSync(istanbulCLIOutput, { recursive: true });
          }

          // Write coverage with unique filename based on test
          const testName = testInfo.titlePath.join('-').replace(/[^a-z0-9]/gi, '_').substring(0, 100);
          const fileName = `coverage-${testName}-${Date.now()}.json`;
          const filePath = path.join(istanbulCLIOutput, fileName);
          
          fs.writeFileSync(filePath, JSON.stringify(coverage));
        }
      } catch (e) {
        // Ignore errors when collecting coverage (page might be closed)
      }
    }
  },
});

export { expect };
