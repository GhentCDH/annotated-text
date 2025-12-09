import { type TextAnnotation as _TextAnnotation } from '../../../model';

type TextAnnotation = Pick<_TextAnnotation, 'start' | 'end'>;

export const sortAnnotations = (
  a: TextAnnotation,
  b: TextAnnotation,
  endDesc = true,
): number => {
  if (a.start === b.start) {
    const desc = endDesc ? -1 : 1;
    const asc = endDesc ? 1 : -1;
    // If both starts are equal, take the one with the longest end first, this to avoid to large annotations on the next lines
    return b.end < a.end ? desc : asc;
  }
  return a.start < b.start ? -1 : 1;
};

export const sortByStart = (
  a: TextAnnotation,
  b: TextAnnotation,
  endDesc = true,
): number => {
  if (a.start === b.start) {
    const desc = endDesc ? -1 : 1;
    const asc = endDesc ? 1 : -1;
    // If both starts are equal, take the one with the longest end first, this to avoid to large annotations on the next lines
    return b.end < a.end ? desc : asc;
  }
  return a.start < b.start ? -1 : 1;
};

export const sortByEnd = (
  a: TextAnnotation,
  b: TextAnnotation,
  endDesc = true,
): number => {
  if (a.end === b.end) {
    const desc = endDesc ? -1 : 1;
    const asc = endDesc ? 1 : -1;
    // If both ends are equal, take the one with the earliest start first
    return a.start < b.start ? desc : asc;
  }
  return a.end < b.end ? -1 : 1;
};
