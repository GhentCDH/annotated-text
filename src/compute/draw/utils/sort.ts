import { TextAnnotation } from "../../annotation.model";

export const sortAnnotations = (
  a: TextAnnotation,
  b: TextAnnotation,
): number => {
  if (a.start === b.start) {
    // If both starts are equal, take the one with the longest end first, this to avoid to large annotations on the next lines
    return b.end < a.end ? -1 : 1;
  }
  return a.start < b.start ? -1 : 1;
};
