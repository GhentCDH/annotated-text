
export interface Annotation {
  start: number,
  end: number,
  text?: string,
  class?: string,
  label?: string,
  target: AnnotationTarget,
  metadata?: Object,
}

export type AnnotationTarget = "gutter" | "span"