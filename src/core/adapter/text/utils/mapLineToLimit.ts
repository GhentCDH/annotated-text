import { type TextLine, textLineSchema } from "../../../model";
import { isIntersection } from "../../../compute/utils/intersect";
import { Limit } from "../TextAdapter";

export type UpdateLineFn = (
  textLine: TextLine,
  start: number,
  end: number,
  isStart: boolean,
) => TextLine;

export const mapLineToLimit = (
  textLine: TextLine,
  limit: Limit,
  updateLine: UpdateLineFn,
): TextLine => {
  if (!limit) {
    return textLineSchema.parse(textLine);
  }

  if (!isIntersection(textLine, limit)) {
    return null;
  }

  if (!limit.ignoreLines) {
    return textLineSchema.parse(textLine);
  }

  let line = textLine;
  if (line.start < limit.start) {
    line = updateLine(line, limit.start, line.end, true);
  }

  if (line.end > limit.end) {
    line = updateLine(line, line.start, limit.end, false);
  }

  return textLineSchema.parse(line);
};
