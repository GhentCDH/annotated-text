import memoize from "memoizee";

const intersect = memoize(
  (a_start: number, a_end: number, b_start: number, b_end: number) => {
    const start = Math.max(a_start, b_start);
    const end = Math.min(a_end, b_end);
    return start < end;
  },
);

export const isIntersection = (
  a: { start: number; end: number },
  b: { start: number; end: number },
): boolean => {
  return intersect(a.start, a.end, b.start, b.end);
};
