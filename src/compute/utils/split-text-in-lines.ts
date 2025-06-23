import { TextLine } from "../annotation.model";

export const splitTextInLines = (text: string): TextLine[] => {
  const lines = text.split(`\n`);
  let start = 0;

  const result = lines.map((text, index) => {
    // Add additional 1 because the \n symbol consist of 2 characters
    const end = start + text.length + 1;
    const line = {
      start,
      end,
      id: `line-${index}`,
      text,
    } as unknown as TextLine;

    start = end;

    return line;
  });

  return result;
};
