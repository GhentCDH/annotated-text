import memoizee from "memoizee";

export const selectText = memoizee(
  (text: string, start: number, end: number, offset: number) => {
    return text.substring(start - offset, end - offset + 1);
  },
);
