import type { AnnotationColor, TextAnnotation } from "../../model";
import { createAnnotationColor } from "../../utils/createAnnotationColor";

export type ColorFn = (annotation: TextAnnotation) => AnnotationColor;

export const DefaultAnnotationColor: ColorFn = (
  annotation: TextAnnotation,
): AnnotationColor => {
  return annotation?.color || createAnnotationColor("#4B7BF5");
};
