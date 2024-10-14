type Span<T> = [number, number, T[]];

/*
  ranges should be an array of [begNum, endNum, data] tuples,
   where endNum > begNum >= 0.
  Works best if ranges is rougly sorted by begNum/endNum
*/
export function FlattenRanges<T>(
  ranges: Iterable<[number, number, T]>
): Span<T>[] {
  const spans: [number, T[]][] = [[0, []]];
  for (const range of ranges) {
    // begIdx is the index of the span that contains range[0]
    // Search backward, presupposing that ranges is roughly sorted by begNum/endNum
    let begIdx = spans.length - 1;
    for (; begIdx >= 0; --begIdx) {
      const span = spans[begIdx];
      if (span[0] <= range[0]) {
        // If range[0] is not the beginning of the span, split it into two and set begIdx to second span
        if (span[0] < range[0]) {
          spans.splice(begIdx + 1, 0, [range[0], spans[begIdx][1].slice()]);
          begIdx += 1;
        }
        break;
      }
    }

    // endIdx is the index of the span that is after range[1]
    // Search backward, presupposing that ranges is roughly sorted by begNum/endNum
    let endIdx = spans.length - 1;
    for (; endIdx >= 0; --endIdx) {
      const spanPrev = spans[endIdx];
      if (spanPrev[0] <= range[1]) {
        // If range[1] is not the beginning of the span, split the prev span into two and set endIdx to second span
        if (spanPrev[0] < range[1]) {
          spans.splice(endIdx + 1, 0, [range[1], spanPrev[1].slice()]);
          endIdx += 1;
        }
        break;
      }
    }

    // Now spans between [begIdx, endIdx) should have the new data, range[2], added to them
    for (let idx = begIdx; idx < endIdx; ++idx) spans[idx][1].push(range[2]);
  }

  // Now return non-empty spans, adding the end of the span to each datapoint
  const fullSpans = [];
  for (let idx = 0; idx < spans.length - 1; ++idx) {
    if (spans[idx][1].length > 0) {
      fullSpans.push([spans[idx][0], spans[idx + 1][0], spans[idx][1]] as [
        number,
        number,
        T[]
      ]);
    }
  }

  return fullSpans;
}
