import memoize from "memoizee";
import {
  createLineAdapter,
  createTextAdapterParams,
  TextAdapter,
} from "./TextAdapter";
import { type TextLine, textLineSchema } from "../../model";

const _textToLines = memoize((text: string): TextLine[] => {
  const lines = text?.split(`\n`) ?? [""];
  let start = 0;

  const result = lines.map((textLine, index) => {
    // Add additional 1 because the \n symbol consist of 2 characters
    const end = start + text.length + 1;
    const line = textLineSchema.parse({
      lineNumber: index,
      start,
      end,
      id: `line-${index}`,
      text: textLine,
      html: `${textLine}`,
      flatText: textLine,
    }) as TextLine;

    start = end;

    return line;
  });

  return result;
});

const textToLines = (text: string): TextLine[] => {
  // Calculation will be cached, but we need to ensure that the objects returned are immutable, so we create new instances of them.
  return _textToLines(text).map((line) => textLineSchema.parse(line));
};

/***
 * PlainTextAdapterImpl is a simple implementation of TextAdapter that parses plain text into TextLine objects.
 * It does not handle any special formatting or annotations, just plain text lines.
 */
export class PlainTextAdapterImpl extends TextAdapter {
  name = "PlainTextAdapter";

  parse(text: string): TextLine[] {
    return textToLines(text);
  }
}

export const PlainTextAdapter = (params: createTextAdapterParams = {}) => {
  return createLineAdapter(new PlainTextAdapterImpl(), params);
};
