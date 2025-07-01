import { viteBundler } from "@vuepress/bundler-vite";
import { defineUserConfig } from "vuepress";

import { hopeTheme } from "vuepress-theme-hope";
import { fileURLToPath } from "node:url";
import componentsSideBar from "../components/typedoc_sidebar.json";
import apiSideBar from "../api/typedoc_sidebar.json";

export default defineUserConfig({
  base: "vue_component_annotated_text",
  title: "Vue annotated text component",
  lastUpdated: true,
  cleanUrls: true,
  metaChunk: true,
  bundler: viteBundler({
    viteOptions: {
      plugins: [],
      resolve: {
        alias: {
          "@ghentcdh/vue-component-annotated-text": fileURLToPath(
            new URL("../../src/index.ts", import.meta.url),
          ),
          "@dev-app": fileURLToPath(
            new URL("../../dev-app/index.ts", import.meta.url),
          ),
          "@demo": fileURLToPath(new URL("../demo/index.ts", import.meta.url)),
        },
      },
    },
    vuePluginOptions: {},
  }),
  // postcss: {
  //   plugins: [require('@tailwindcss/postcss'), require('autoprefixer')],
  // },
  theme: hopeTheme({
    darkmode: "disable",
    docsRepo: "https://github.com/GhentCDH/vue_component_annotated_text",
    docsBranch: "main",
    docsDir: "docs",
    // editLinkPattern: ':repo/tree/:branch/:path',
    lastUpdated: true,
    colorMode: "light",
    socialLinks: [
      {
        icon: "github",
        link: "https://github.com/GhentCDH/vue_component_annotated_text",
      },
    ],
    // colorModeSwitch: false,
    navbar: [
      {
        text: "Home",
        link: "/",
      },
    ],
    sidebar: [
      componentsSideBar,

      {
        text: "api",
        children: apiSideBar,
        link: "/api/globals.md",
        extended: false,
        collapsible: true,
      },
    ].flat(),
  }),
});
