import memoize from "memoizee";
import type { AnnotationColor } from "../../../types/AnnotationColor";

const annotationGutterStyle_ = (background?: string): string[] => {
  if (!background) return [];

  return [`--gutter-bg-color: ${background}`];
};
export const annotationGutterStyleMemoizee = memoize(annotationGutterStyle_);

export const annotationGutterStyle = (
  color: AnnotationColor | string
): string[] => {
  return annotationGutterStyleMemoizee(
    typeof color === "string" ? color : color?.gutterColor
  );
};
