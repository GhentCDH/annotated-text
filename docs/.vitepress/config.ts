// Auto generated file from BaseConfig.ts add your adjustments there

import { defineConfig } from "vitepress";
import componentsSideBar from "../components/typedoc_sidebar.json";
import apiSideBar from "../api/typedoc-sidebar.json";

const { BASE: base = "/" } = process.env;

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Vue annotated text component",
  base,
  description:
    "This repository contains a reusable Vue 3 component to visualize text annotations on web pages. It can be used for linguistic analysis, text structure or other annotations on unicode text. It is best explained by the following screenshots:",
  themeConfig: {
    nav: [
      { text: "Home", link: "/" },
      { text: "Components", link: "/components" },
      { text: "Api", link: "/api" },
    ],
    sidebar: [
      {
        text: "components",
        items: componentsSideBar,
      },
      {
        text: "api",
        items: apiSideBar,
      },
    ],
    socialLinks: [
      {
        icon: "github",
        link: "https://github.com/GhentCDH/vue_component_annotated_text",
      },
    ],
    lastUpdated: {
      text: "Updated at",
      formatOptions: {
        dateStyle: "full",
        timeStyle: "medium",
      },
    },
    footer: {
      message: "",
      copyright:
        "Built @ the Ghent Center For Digital Humanities, Ghent University",
    },
  },
});
