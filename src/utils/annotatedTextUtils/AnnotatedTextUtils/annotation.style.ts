import memoize from "memoizee";
import type { AnnotationColor } from "../../../types/AnnotationColor";

const annotationStyle_ = (color: AnnotationColor): string[] => {
  if (!color) return [];

  const { border, background, borderActive, backgroundActive } = color;

  return [
    `--annotation-bg-color: ${background}`,
    `--annotation-border-color: ${border}`,
    `--annotation-bg-color--active: ${backgroundActive}`,
    `--annotation-border-color--active: ${borderActive}`,
  ];
};
export const annotationStyle = memoize(annotationStyle_);
