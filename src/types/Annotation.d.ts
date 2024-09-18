export interface Annotation {
  id: string;
  start: number;
  end: number;
  class?: string;
  label?: string;
  target: AnnotationTarget;
  weight?: number;
}

export type AnnotationTarget = "gutter" | "text";