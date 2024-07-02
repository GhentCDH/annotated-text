import { AnnotationLayer } from "./AnnotatedText";

export interface Annotation {
  id: number | string;
  start: number;
  end: number;
  text?: string;
  class?: string;
  label?: string;
  target: AnnotationTarget;
  layer?: AnnotationLayer;
  weight?: number;
  active?: boolean;
  visible?: boolean;
}

export interface ExtendedAnnotation extends Annotation {
  layer?: AnnotationLayer;
  weight?: number;
}

export type AnnotationTarget = "gutter" | "span";
