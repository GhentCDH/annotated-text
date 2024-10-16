import memoize from "memoizee";
import type { AnnotationColor } from "../../../types/AnnotationColor";
import { createAnnotationColor } from "../../createAnnotationColor";

const annotationStyle_ = (color: AnnotationColor): string[] => {
  if (!color) return [];

  const { border, background, borderActive, backgroundActive } =
    typeof color === "string" ? createAnnotationColor(color) : color;

  return [
    `--annotation-bg-color: ${background}`,
    `--annotation-border-color: ${border}`,
    `--annotation-bg-color--active: ${backgroundActive}`,
    `--annotation-border-color--active: ${borderActive}`,
  ];
};
export const annotationStyle = memoize(annotationStyle_);
