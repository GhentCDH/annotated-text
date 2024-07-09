export interface Annotation {
  id: string;
  start: number;
  end: number;
  text?: string;
  class?: string;
  label?: string;
  target: AnnotationTarget;
  weight?: number;
  active?: boolean;
  visible?: boolean;
}

export interface EditAnnotation {
  position: number;
  Annotation: Annotation;
}

export type AnnotationTarget = "gutter" | "span";
