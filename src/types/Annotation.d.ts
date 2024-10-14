import type { AnnotationColor } from "./AnnotationColor";

export interface Annotation {
  id: string;
  start: number;
  end: number;
  class?: string;
  label?: string;
  target: AnnotationTarget;
  weight?: number;

  color?: string | AnnotationColor;
}

export type AnnotationTarget = "gutter" | "text";
