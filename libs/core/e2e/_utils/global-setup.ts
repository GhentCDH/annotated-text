import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function globalSetup() {
  if (process.env.COVERAGE === 'true') {
    const coverageDir = path.resolve(__dirname, '..', 'coverage', 'e2e');
    const nycOutputDir = path.resolve(coverageDir, '.nyc_output');
    
    // Clean up previous coverage data
    if (fs.existsSync(coverageDir)) {
      fs.rmSync(coverageDir, { recursive: true });
    }
    fs.mkdirSync(nycOutputDir, { recursive: true });
    
    console.log('✓ E2E Coverage enabled - cleaned coverage directory');
  }
}

export default globalSetup;
