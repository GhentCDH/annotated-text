/// <reference types='vitest' />
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import * as path from 'path';
import { copyFileSync, globSync } from 'fs';

// These options were migrated by @nx/vite:convert-to-inferred from the project.json file.
const configValues = { default: {}, production: {}, development: {} };

// Determine the correct configValue to use based on the configuration
const nxConfiguration = process.env.NX_TASK_TARGET_CONFIGURATION ?? 'default';

const options = {
  ...configValues.default,
  ...(configValues[nxConfiguration] ?? {}),
};

export default defineConfig(() => ({
  resolve: {
    tsconfigPaths: true,
  },
  root: import.meta.dirname,
  cacheDir: '../../node_modules/.vite/w3c/utils',
  plugins: [
    {
      // Replaces the removed nxCopyAssetsPlugin(['*.md']): copy project-root markdown into the build output.
      name: 'copy-markdown',
      writeBundle: ({ dir }) => {
        for (const file of globSync('*.md', { cwd: import.meta.dirname })) {
          copyFileSync(
            path.join(import.meta.dirname, file),
            path.join(dir!, file),
          );
        }
      },
    },
    dts({
      entryRoot: 'src',
      tsconfigPath: path.join(import.meta.dirname, 'tsconfig.lib.json'),
      pathsToAliases: false,
    }),
  ],
  // Uncomment this if you are using workers.
  // worker: {
  //  plugins: [],
  // },
  // Configuration for building your library.
  // See: https://vite.dev/guide/build.html#library-mode
  build: {
    outDir: '../../../dist/w3c/utils',
    emptyOutDir: true,
    reportCompressedSize: true,
    commonjsOptions: {
      transformMixedEsModules: true,
    },
    lib: {
      // Could also be a dictionary or array of multiple entry points.
      entry: 'src/index.ts',
      name: 'utils',
      fileName: 'index',
      // Change this to the formats you want to support.
      // Don't forget to update your package.json as well.
      format: ['cjs', 'esm', 'es'],
    },
    rolldownOptions: {
      // External packages that should not be bundled into your library.
      external: [],
    },
  },
  test: {
    name: 'utils',
    watch: false,
    globals: true,
    environment: 'node',
    include: ['{src,tests}/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    reporters: ['default'],
    coverage: {
      reportsDirectory: '../../coverage/w3c/utils',
      provider: 'v8' as const,
    },
  },
}));
