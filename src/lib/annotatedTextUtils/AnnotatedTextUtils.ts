import type { AnnotatedLine, Annotation } from "@/types";

export const startsOnLine = function (
  line: AnnotatedLine,
  annotation: Annotation
): Boolean {
  return line.start <= annotation.start && line.end >= annotation.start;
};

export const endsOnLine = function (
  line: AnnotatedLine,
  annotation: Annotation
): Boolean {
  return line.start <= annotation.end && line.end >= annotation.end;
};