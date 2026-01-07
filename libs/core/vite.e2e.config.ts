import { defineConfig } from 'vite';
import istanbul from 'vite-plugin-istanbul';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import dts from 'vite-plugin-dts';
import { fileURLToPath } from 'url';
import path, { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const isCoverage = process.env.COVERAGE === 'true';

export default defineConfig({
  root: resolve(__dirname, 'e2e'),
  plugins: [
    nxViteTsPaths(),
    dts({
      entryRoot: 'src',
      tsconfigPath: path.join(__dirname, 'tsconfig.lib.json'),
      pathsToAliases: false,
    }),
    ...(isCoverage
      ? [
          istanbul({
            include: ['src/**/*.ts'],
            exclude: [
              'node_modules/**',
              'e2e/**/*',
              '**/*.spec.ts',
              '**/*.test.ts',
              '**/*.scss',
              '**/*.css',
              '**/style/**',
              '**/index.e2e.ts',
            ],
            extension: ['.ts'],
            requireEnv: false,
            forceBuildInstrument: true,
            cwd: __dirname,
          }),
        ]
      : []),
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
