import type { TextAnnotation } from "../../model";

export type GutterFn<ANNOTATION> = (annotation: ANNOTATION) => boolean;

export const DefaultAnnotationGutter = <ANNOTATION>(
  annotation: ANNOTATION,
): boolean => {
  return (annotation as TextAnnotation)?.target === "gutter";
};
