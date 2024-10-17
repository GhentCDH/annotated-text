import fs from "fs";
import path from "path";

const docsPath = "docs/";

function writeSidebarFile(dir, sidebar) {
  fs.writeFileSync(
    path.join(dir, "typedoc_sidebar.json"),

    JSON.stringify(sidebar)
  );
}

function formatText(text) {
  return text.charAt(0).toUpperCase() + text.replaceAll("-", " ").slice(1);
}

function generateDirectoryObject(dir, exclude) {
  const dirPath = path.join(docsPath, dir);
  const items = [];

  const files = fs.readdirSync(dirPath);
  files.forEach((file) => {
    const filePath = path.join(dirPath, file);
    const stat = fs.statSync(filePath);

    console.log(exclude, file, exclude.indexOf(file));

    if (exclude.indexOf(file) !== -1) return;

    if (stat.isFile()) {
      const fileName = file.substring(0, file.lastIndexOf("."));

      if (!file.endsWith(".md")) return;
      if (file === "index.md") return;
      items.push({
        text: formatText(fileName),
        link: `/${dir}/${fileName}`,
      });
    }

    if (stat.isDirectory()) {
      items.push(generateDirectoryObject(path.join(dir, file), exclude));
    }
  });

  const dirName = path.basename(dirPath);
  return {
    text: formatText(dirName),
    items: items,
    collapsed: true,
    link: items.length === 0 ? `/${dir}` : "",
  };
}

function createMenu(dir, exclude = []) {
  const dirPath = path.join(docsPath, dir);

  const items = generateDirectoryObject(dir, exclude);

  writeSidebarFile(dirPath, items.items);
}

createMenu("components");
createMenu("api", ["_media", "globals.md"]);
