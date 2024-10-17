import memoize from "memoizee";
import type { AnnotationColor } from "../../../types/AnnotationColor";

const annotationGutterStyle_ = (background?: string): string[] => {
  if (!background) return [];

  return [`--gutter-bg-color: ${background}`];
};
export const annotationGutterStyleMemoizee = memoize(annotationGutterStyle_);

export const annotationGutterStyle = (color: AnnotationColor): string[] => {
  return annotationGutterStyleMemoizee(color?.gutterColor);
};
