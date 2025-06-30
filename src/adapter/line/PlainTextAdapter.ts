import {
  createLineAdapter,
  createTextAdapterParams,
  TextAdapter,
} from "./TextAdapter";
import { type TextLine, textLineSchema } from "../../model";

export class PlainTextAdapterImpl extends TextAdapter {
  name = "PlainTextAdapter";

  parse(text: string): TextLine[] {
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
  }
}

export const PlainTextAdapter = (params: createTextAdapterParams = {}) => {
  return createLineAdapter(new PlainTextAdapterImpl(), params);
};
