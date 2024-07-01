import { Line } from "@/types";

export const textToLines = (text: string): Line[] => {
  const regLineNumber = /^([0-9/]+[a-z]?)\./g;
  let lineStart = 0;
  let lineEnd = 0;
  let gutter = "";

  // split text into lines
  const lines = text.split("\n");
  const lineObjects = [] satisfies Line[];

  // split lines into line number, text, start and end
  for (let i = 0; i < lines.length; i++) {
    lineEnd = lineStart + (lines[i].length - 1);
    gutter = lines[i].match(regLineNumber)
      ? lines[i].match(regLineNumber)[0]
      : "";
    lineObjects[i] = {
      gutter: gutter,
      text: lines[i].replace(regLineNumber, ""),
      start: lineStart + gutter.length,
      end: lineEnd,
    };
    lineStart = lineEnd + 2;

    //empty lines:
    lineObjects[i].end = Math.max(lineObjects[i].end, lineObjects[i].start);
  }
  console.log("line objects", lineObjects);
  return lineObjects;
};