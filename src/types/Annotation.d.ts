import { AnnotationLayer } from "./AnnotatedText";

export interface Annotation {
  id: number | string;
  start: number;
  end: number;
  text?: string;
  class?: string;
  label?: string;
  target: AnnotationTarget;
  metadata?: {
    id?: number;
    text?: string;
    index?: number;
  };
  layer?: AnnotationLayer;
  weight?: number;
  active?: boolean;
  visible?: boolean;
}

export interface AnnotationDataIn {
  start: number;
  end: number;
  class: string;
  target: AnnotationTarget;
  metadata: {
    id: number;
    text?: string;
    index?: number;
  };
  label: string;
}

export interface ExtendedAnnotation extends Annotation {
  layer?: AnnotationLayer;
  weight?: number;
}

export type AnnotationTarget = "gutter" | "span";
