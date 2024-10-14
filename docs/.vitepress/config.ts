// Auto generated file from BaseConfig.ts add your adjustments there

import { defineConfig } from "vitepress";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Vue annotated text component",
  description:
    "This repository contains a reusable Vue 3 component to visualize text annotations on web pages. It can be used for linguistic analysis, text structure or other annotations on unicode text. It is best explained by the following screenshots:",
  themeConfig: {
    nav: [
      { text: "Home", link: "/" },
      { text: "Components", link: "/components" },
    ],
    sidebar: [
      {
        text: "components",
        items: [
          { text: "AnnotatedText", link: "/components/AnnotatedText.md" },
        ],
      },
      {
        text: "typedoc",
        items: [
          { text: "README", link: "/typedoc/README.md" },
          { text: "modules", link: "/typedoc/modules.md" },
        ],
      },
    ],
    socialLinks: [
      { icon: "github", link: "https://github.com/vuejs/vitepress" },
    ],
  },
});
