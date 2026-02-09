import { viteBundler } from '@vuepress/bundler-vite';
import { defineUserConfig } from 'vuepress';

import { hopeTheme } from 'vuepress-theme-hope';
import { fileURLToPath } from 'node:url';
import componentsSideBar from '../components/typedoc_sidebar.json';

export default defineUserConfig({
  base: 'annotated-text',
  title: 'Annotated text component',
  lastUpdated: true,
  cleanUrls: true,
  metaChunk: true,
  bundler: viteBundler({
    viteOptions: {
      plugins: [],
      resolve: {
        alias: {
          '@ghentcdh/annotated-text': fileURLToPath(
            new URL('../../libs/core/src/index.ts', import.meta.url),
          ),
          '@demo': fileURLToPath(new URL('../demo/index.ts', import.meta.url)),
        },
      },
    },
    vuePluginOptions: {},
  }),
  // postcss: {
  //   plugins: [require('@tailwindcss/postcss'), require('autoprefixer')],
  // },
  theme: hopeTheme({
    darkmode: 'disable',
    docsRepo: 'https://github.com/GhentCDH/annotated-text',
    docsBranch: 'main',
    docsDir: 'docs',
    // editLinkPattern: ':repo/tree/:branch/:path',
    lastUpdated: true,
    colorMode: 'light',
    socialLinks: [
      {
        icon: 'github',
        link: 'https://github.com/GhentCDH/annotated-text',
      },
    ],
    // colorModeSwitch: false,
    navbar: [
      {
        text: 'Home',
        link: '/',
      },
    ],
    sidebar: [componentsSideBar].flat(),
  }),
});
