import { v4 as uuidv4 } from "uuid";
import {
  createLineAdapter,
  createLineAdapterParams,
  LineAdapter,
} from "./LineAdapter";
import { TextLine } from "../../compute/annotation.model";
import { Line } from "../../types/AnnotatedText";

export class PlainTextAdapterImpl extends LineAdapter<string> {
  name = "PlainTextAdapter";

  parse(text: string): TextLine[] {
    const lines = text?.split(`\n`) ?? [""];
    let start = 0;

    const result = lines.map((text, index) => {
      // Add additional 1 because the \n symbol consist of 2 characters
      const end = start + text.length + 1;
      const line = {
        uuid: uuidv4(),
        lineNumber: index,
        start,
        end,
        id: `line-${index}`,
        text,
      } as unknown as TextLine;

      start = end;

      return line;
    });

    return result;
  }
}

export const PlainTextAdapter = (
  params: createLineAdapterParams<Line[]> = {},
) => {
  return createLineAdapter(new PlainTextAdapterImpl(), params);
};
