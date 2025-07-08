import { type TextLine, textLineSchema } from "../../../model";
import { isIntersection } from "../../../compute/utils/intersect";
import { Limit } from "../TextAdapter";

export type UpdateLineFn = (
  textLine: TextLine,
  start: number,
  end: number,
  diff: { start: number; end: number },
) => TextLine;

export const getDiff = (line: TextLine, limit: Limit) => {
  const { start, end } = limit;
  const s_diff = start === line.start ? 0 : start - line.start;
  let e_diff = line.end;

  if (line.end !== end) {
    const endDiff = line.end - end;
    e_diff = line.text.length - endDiff + 1;
  }

  return { start: s_diff, end: e_diff };
};

export const mapLineToLimit = (
  textLine: TextLine,
  limit: Limit,
  updateLine: UpdateLineFn,
): TextLine => {
  if (!limit) {
    return textLineSchema.parse(textLine);
  }

  if (!limit.ignoreLines) {
    return textLineSchema.parse(textLine);
  }

  if (!isIntersection(textLine, limit)) {
    return null;
  }

  let line = textLine;
  if (line.start < limit.start) {
    const diff = getDiff(line, limit);
    line = updateLine(line, limit.start, line.end, diff);
  }

  if (line.end > limit.end) {
    const diff = getDiff(line, limit);
    line = updateLine(line, line.start, limit.end, diff);
  }

  return textLineSchema.parse(line);
};
