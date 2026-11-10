import { defineConfig } from 'vite';
// import istanbul from 'vite-plugin-istanbul';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import { readFileSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Replaces the removed nxViteTsPaths(): native resolve.tsconfigPaths skips e2e files
// because the workspace tsconfigs exclude **/e2e/**, so alias tsconfig.base.json paths directly.
const tsconfigPaths: Record<string, string[]> = JSON.parse(
  readFileSync(resolve(__dirname, '../tsconfig.base.json'), 'utf8'),
).compilerOptions.paths;

const isCoverage = process.env.COVERAGE === 'true';

export default defineConfig({
  resolve: {
    alias: Object.entries(tsconfigPaths).map(([find, [path]]) => ({
      find: new RegExp(`^${find}$`),
      replacement: resolve(__dirname, '..', path),
    })),
  },
  root: __dirname,
  plugins: [
    // dts({
    //   entryRoot: 'src',
    //   tsconfigPath: path.join(__dirname, '../libs/core/tsconfig.lib.json'),
    //   pathsToAliases: false,
    // }),
    // ...(isCoverage
    //   ? [
    //       istanbul({
    //         include: ['src/**/*.ts'],
    //         exclude: [
    //           'node_modules/**',
    //           'e2e/**/*',
    //           '**/*.spec.ts',
    //           '**/*.test.ts',
    //           '**/*.scss',
    //           '**/*.css',
    //           '**/style/**',
    //           '**/index.e2e.ts',
    //         ],
    //         extension: ['.ts'],
    //         requireEnv: false,
    //         forceBuildInstrument: true,
    //         cwd: resolve(__dirname, '../libs/core'),
    //       }),
    //     ]
    //   : []),
  ],
  // resolve: {
  //   alias: {
  //     // Always use the e2e entry point (no SCSS import) to avoid Babel/SCSS conflicts
  //     // Styles are imported directly in setup files
  //     '@ghentcdh/annotated-text': resolve(__dirname, 'src/index.e2e.ts'),
  //   },
  // },
  // css: {
  //   preprocessorOptions: {
  //     scss: {
  //       api: 'modern-compiler',
  //     },
  //   },
  // },
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
