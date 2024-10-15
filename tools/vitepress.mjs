import fs from "fs";
import path from "path";

const docsPath = "docs/";

function writeSidebarFile (dir, sidebar) {

  fs.writeFileSync(
    path.join(dir, "typedoc_sidebar.json"),

    JSON.stringify(sidebar)
  );
}

function generateDirectoryObject(dir) {
  const dirPath = path.join(docsPath, dir);
  const items = [];

  const files = fs.readdirSync(dirPath);
  files.forEach((file) => {
    const filePath = path.join(dirPath, file);
    const stat = fs.statSync(filePath);

    if (stat.isFile()) {
      const fileName = file.substring(0, file.lastIndexOf("."));

      if(!file.endsWith('.md')) return
      if (file === "index.md") return;
      items.push({
        text: fileName,
        link: `/${dir}/${fileName}`,
      });
    }

    if(stat.isDirectory()){
      items.push(generateDirectoryObject(path.join(dir, file)))
    }
  });


  const dirName = path.basename(dirPath);
  return {
    text: dirName,
    items: items,
    link: items.length===0?`/${dir}`:'',
  };
}

function createMenu(dir){
  const dirPath = path.join(docsPath, dir);

  const items= generateDirectoryObject(dir)


  writeSidebarFile(dirPath, items.items);
}

createMenu('components')