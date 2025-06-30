import memoize from "memoizee";
import { type TextLine, textLineSchema } from "../../../model";

export const textToLines = memoize((text: string): TextLine[] => {
  text = text.replace(/\r\n/g, "\n").replace(/\u000b/g, "\n");
  const regLineNumber = /^([0-9/]+[a-z]?)\./g;
  let lineStart = 0;
  let lineEnd = 0;
  let gutter = "";

  // split text into lines
  const lines = text.split("\n");
  const lineObjects = [] as TextLine[];

  // split lines into line number, text, start and end
  for (let i = 0; i < lines.length; i++) {
    lineEnd = lineStart + (lines[i].length - 1);
    const matchArray = lines[i].match(regLineNumber);

    if (matchArray) {
      gutter = matchArray[0];
    } else {
      gutter = "";
    }

    const start = lineStart + gutter.length;
    const _end = lineEnd;

    //empty lines:
    const end = Math.max(_end, start);
    const text = lines[i].replace(regLineNumber, "");

    const lineObject = textLineSchema.parse({
      gutter: gutter,
      text,
      start,
      end,
      id: `line-${i}`,
      html: text,
      flatText: text,
      lineNumber: i,
    });
    lineObjects.push(lineObject);
    lineStart = lineEnd + 2;

    //empty lines:
    // lineObjects[i].end = Math.max(lineObjects[i].end, lineObjects[i].start);
  }
  return lineObjects;
});
