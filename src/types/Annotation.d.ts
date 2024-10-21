import type { AnnotationColor } from "./AnnotationColor";

/**
 * Internal representation of an annotation. Enriched with the original annotation only supposed to used internally.
 */
export interface AnnotationInternal {
  id: string;
  start: number;
  end: number;
  class?: string;
  label?: string;
  target: AnnotationTarget;
  weight?: number;

  color?: AnnotationColor;

  startsOnLine?: boolean;
  endsOnLine?: boolean;
}

export type Annotation = Omit<
  AnnotationInternal,
  "startsOnLine" | "endsOnline" | "class"
>;

export type AnnotationTarget = "gutter" | "text";
