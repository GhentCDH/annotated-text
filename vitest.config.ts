import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    coverage: {
      provider: "v8", // or 'c8'
      reporter: ["text", "lcov"], // lcov for codecov or coveralls
    },
  },
});
