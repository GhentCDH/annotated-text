import { v4 as uuidv4 } from "uuid";
import {
  createLineAdapter,
  createLineAdapterParams,
  LineAdapter,
} from "./LineAdapter";
import { TextLine } from "../../compute/annotation.model";
import { Line } from "../../types/AnnotatedText";

export class DefaultLineAdapterImpl extends LineAdapter<Line[]> {
  name = "DefaultLineAdapter";

  parse(lines: Line[]): TextLine[] {
    if (!lines) return [];
    // Default implementation simply returns the lines as they are
    return lines.map((line, lineNumber) => {
      return { uuid: uuidv4(), lineNumber, ...line } as TextLine;
    });
  }
}

export const DefaultLineAdapter = (
  params: createLineAdapterParams<Line[]> = {},
) => {
  return createLineAdapter(new DefaultLineAdapterImpl(), params);
};
