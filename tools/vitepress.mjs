import fs from "fs";
import path from "path";
import { BaseConfig } from "../docs/.vitepress/BaseConfig.js";

const docsPath = "docs/";

function generateDirectoryObject(dir) {
  const dirPath = path.join(docsPath, dir);
  const dirName = path.basename(dirPath);
  const items = [];

  const files = fs.readdirSync(dirPath);
  files.forEach((file) => {
    const filePath = path.join(dirPath, file);
    const stat = fs.statSync(filePath);

    if (stat.isFile()) {
      if (file === "index.md") return;
      items.push({
        text: file.substring(0, file.lastIndexOf(".")),
        link: `/${dirName}/${file}`,
      });
    }
  });

  return {
    text: dirName,
    items: items,
  };
}
const sidebar = [
  generateDirectoryObject("components"),
  generateDirectoryObject("typedoc"),
];
console.log(sidebar)
fs.writeFileSync(
  path.join(docsPath, ".vitepress/config.ts"),

  `
  // Auto generated file from BaseConfig.ts add your adjustments there
  
  import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig( 
${JSON.stringify({
  ...BaseConfig,
    themeConfig:{...BaseConfig.themeConfig,
      sidebar: [BaseConfig.themeConfig?.sidebar ?? [], sidebar].flat(),
    },

})}
)
`
);
