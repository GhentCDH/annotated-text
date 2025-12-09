import memoize from 'memoizee';
import { type TextLine, textLineSchema } from '../../../model';
import { isIntersection } from '../../../compute/utils/intersect';
import { type Limit } from '../TextAdapter';

export type UpdateLineFn = (
  textLine: TextLine,
  start: number,
  end: number,
  diff: { start: number; end: number },
) => TextLine;

const getStart = memoize((lineStart: number, limitStart: number) => {
  if (limitStart <= lineStart) return 0;
  return limitStart - lineStart;
});

const getEnd = memoize(
  (lineStart: number, lineEnd: number, limitEnd: number) => {
    if (lineEnd <= limitEnd) return lineEnd - lineStart;
    return limitEnd - lineStart;
  },
);

export const getDiff = (line: TextLine, limit: Limit) => {
  const start = getStart(line.start, limit!.start);
  const end = getEnd(line.start, line.end, limit!.end);

  return { start, end };
};

export const mapLineToLimit = (
  textLine: TextLine,
  limit: Limit,
  updateLine: UpdateLineFn,
): TextLine | null => {
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
    const diff = getDiff(line, limit);
    line = updateLine(line, limit.start, line.end, diff);
  }

  if (line.end > limit.end) {
    const diff = getDiff(line, limit);
    line = updateLine(line, line.start, limit.end, diff);
  }

  return textLineSchema.parse(line);
};

export const mapLinesToLimit = (
  textLines: TextLine[],
  limit: Limit,
  updateLine: UpdateLineFn,
): TextLine[] => {
  return textLines
    .map((line) => mapLineToLimit(line, limit, updateLine))
    .filter(Boolean) as TextLine[];
};
