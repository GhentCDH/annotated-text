import memoizee from 'memoizee';

export const selectText = memoizee(
  (
    text: string,
    start: number,
    end: number,
    offset: number,
    prefixOffset = 10,
  ) => {
    const exactStart = start - offset;
    let prefixStart = exactStart - prefixOffset;
    if (prefixStart < 0) prefixStart = 0;

    const exactEnd = end - offset + 1;
    let suffixEnd = exactEnd + prefixOffset;
    if (suffixEnd > text.length) suffixEnd = text.length;

    return {
      prefix: text.substring(prefixStart, exactStart),
      exact: text.substring(exactStart, exactEnd),
      suffix: text.substring(exactEnd, suffixEnd),
    };
  },
);
