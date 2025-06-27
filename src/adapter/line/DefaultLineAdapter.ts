import {
  createLineAdapter,
  createLineAdapterParams,
  LineAdapter,
} from "./LineAdapter";
import { type Line, type TextLine, textLineSchema } from "../../model";

export class DefaultLineAdapterImpl extends LineAdapter<Line[]> {
  name = "DefaultLineAdapter";

  parse(lines: Line[]): TextLine[] {
    if (!lines) return [];
    // Default implementation simply returns the lines as they are
    return lines.map((line, lineNumber) => {
      return textLineSchema.parse({
        lineNumber,
        ...line,
        html: line.text,
        flatText: line.text,
      }) as TextLine;
    });
  }
}

export const DefaultLineAdapter = (
  params: createLineAdapterParams<Line[]> = {},
) => {
  return createLineAdapter(new DefaultLineAdapterImpl(), params);
};
