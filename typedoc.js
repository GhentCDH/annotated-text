/** @type {Partial<import('typedoc').TypeDocOptions>} */
const config = {
  entryPoints: ["./src/index.ts"],
  out: "docs/api",
  plugin: [
    "typedoc-plugin-markdown",
    "typedoc-plugin-vue",
    "typedoc-vitepress-theme",
  ],
};

export default config;
