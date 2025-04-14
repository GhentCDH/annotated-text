import { viteBundler } from "@vuepress/bundler-vite";
import { defaultTheme } from "@vuepress/theme-default";
import { defineUserConfig } from "vuepress";

import { fileURLToPath } from "node:url";
import componentsSideBar from "../components/typedoc_sidebar.json";
import demoSidebar from "../demo/typedoc_sidebar.json";

export default defineUserConfig({
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
  theme: defaultTheme({
    docsRepo: "https://github.com/GhentCDH/vue_component_annotated_text",
    docsBranch: "master",
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
      demoSidebar,
      // {
      //   text: 'api',
      //   children: apiSideBar1,
      // },
    ].flat(),
  }),
});
