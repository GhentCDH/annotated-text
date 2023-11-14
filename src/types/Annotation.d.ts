export interface Annotation {
  start: number;
  end: number;
  text?: string;
  class?: string;
  label?: string;
  target: AnnotationTarget;
  metadata?: Object;
  weight?: number;
}

export type AnnotationTarget = "gutter" | "span";
