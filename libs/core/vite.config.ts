// libs/core/vite.config.ts
import { defineConfig } from "vite";
import { nxViteTsPaths } from "@nx/vite/plugins/nx-tsconfig-paths.plugin";
import * as path from "path";
import { nxCopyAssetsPlugin } from "@nx/vite/plugins/nx-copy-assets.plugin";
import dts from "vite-plugin-dts";
import { checker } from "vite-plugin-checker";

export default defineConfig({
  // lets Vitest resolve your TS path aliases from tsconfig.base.json
  plugins: [
    nxViteTsPaths(),
    nxCopyAssetsPlugin(["*.md"]),
    checker({ typescript: true }),
    dts({
      entryRoot: "src",
      tsconfigPath: path.join(__dirname, "tsconfig.lib.json"),
    }),
  ],
  build: {
    outDir: "../../dist/libs/core",
    emptyOutDir: true,
    reportCompressedSize: true,
    commonjsOptions: {
      transformMixedEsModules: true,
    },
    lib: {
      entry: "src/index.ts",
      name: "AnnotatedText",
      fileName: "index",
      formats: ["es", "cjs"],
    },
    rollupOptions: {
      external: [],
      output: {},
    },
  },
  test: {
    globals: true,
    // For a pure TS utility lib, Node env is usually right.
    // If you need DOM APIs, change to 'jsdom'.
    environment: "node",
    include: ["src/**/*.{spec,test}.ts"],
    coverage: {
      reporter: ["text", "lcov"],
      all: true,
      include: ["src/**/*.ts"],
      exclude: ["src/**/*.{spec,test}.ts"],
    } as any,
  },
});
