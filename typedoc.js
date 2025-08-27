/** @type {Partial<import("typedoc").TypeDocOptions>} */
const config = {
  entryPoints: ["./libs/core/src/index.ts"],
  out: "docs/api",
  plugin: [
    "typedoc-plugin-markdown",
    "typedoc-plugin-vue",
    "typedoc-vitepress-theme",
  ],
};

export default config;
