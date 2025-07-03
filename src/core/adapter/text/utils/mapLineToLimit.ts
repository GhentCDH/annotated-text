import {
  Limit,
  TextLine,
  textLineSchema,
} from "@ghentcdh/vue-component-annotated-text";
import { isIntersection } from "../../../compute/utils/intersect";

export type UpdateLineFn = (
  textLine: TextLine,
  start: number,
  end: number,
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
    line = updateLine(line, limit.start, line.end);
  }

  if (line.end > limit.end) {
    line = updateLine(line, line.start, limit.end);
  }

  return textLineSchema.parse(line);
};
