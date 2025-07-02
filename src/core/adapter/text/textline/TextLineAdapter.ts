import { _textToLines } from "./text_utilities";
import {
  createTextAdapter,
  createTextAdapterParams,
  Limit,
  TextAdapter,
} from "../TextAdapter";
import { type TextLine, textLineSchema } from "../../../model";
import { isIntersection } from "../../../compute/utils/intersect";

const mapLineToLimit = (line: TextLine, limit: Limit): TextLine => {
  if (!isIntersection(line, limit)) {
    return null;
  }

  if (!limit || !limit.ignoreLines) {
    return textLineSchema.parse(line);
  }

  const updateLine = (start: number, end: number) => {
    const s_diff = start === line.start ? 0 : start - line.start;
    const e_diff = line.end === end ? line.end : line.end - end;
    const flatText = line.flatText.substring(s_diff, e_diff);
    line = textLineSchema.parse({
      ...line,
      text: flatText,
      flatText,
      html: flatText,
      start: start,
      end,
    });
  };

  if (line.start < limit.start) {
    updateLine(limit.start, line.end);
  }

  if (line.end > limit.end) {
    updateLine(line.start, limit.end);
  }

  return textLineSchema.parse(line);
};

const textToLines = (text: string, limit: Limit): TextLine[] => {
  // Calculation will be cached, but we need to ensure that the objects returned are immutable, so we create new instances of them.
  return _textToLines(text)
    .map((line) => mapLineToLimit(line, limit))
    .filter(Boolean);
};

/**
 * This adapter is used to parse a text that includes line numbers.
 *
 * f.e. `1.Χ[αι]ρήμ[ων] Ἀπολλωνίωι τῶι\n2.[φι]λτάτωι χαίρειν.`
 * will be parsed into an array of TextLine objects of 2 lines, in the gutter the line number will appear.
 */
export class TextLineAdapterImpl extends TextAdapter {
  name = "TextLineAdapter";

  parse(text: string): TextLine[] {
    return textToLines(text, this.limit);
  }
}

export const TextLineAdapter = (params: createTextAdapterParams = {}) => {
  return createTextAdapter(new TextLineAdapterImpl(), params);
};
