import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function globalTeardown() {
  if (process.env.COVERAGE === 'true') {
    const nycOutputDir = path.resolve(__dirname, '..', 'coverage', '.nyc_output');
    
    // Check if any coverage files were written
    if (fs.existsSync(nycOutputDir)) {
      const files = fs.readdirSync(nycOutputDir);
      console.log(`✓ Coverage collection complete - ${files.length} coverage file(s)`);
    }
  }
}

export default globalTeardown;
