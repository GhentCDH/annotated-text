import type { Annotation, AnnotationColor } from "../../model";
import { createAnnotationColor } from "../../utils/createAnnotationColor";

export type ColorFn<ANNOTATION> = (annotation: ANNOTATION) => AnnotationColor;

export const DefaultAnnotationColor = <ANNOTATION>(
  annotation: ANNOTATION,
): AnnotationColor => {
  return (annotation as Annotation)?.color || createAnnotationColor("#4B7BF5");
};
