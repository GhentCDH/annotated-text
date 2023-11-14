export interface Annotation {
  id?: string | number;
  start: number;
  end: number;
  text?: string;
  class?: string;
  label?: string;
  target: AnnotationTarget;
  metadata?: Object;
  weight?: number;
}

export interface AnnotationLayer {
  id?: string | number;
  annotations?: Annotation[];
  render?: AnnotationLayerRenderType;
  class?: string;
  showLabels?: boolean;
  // autoAnnotationWeights?: boolean;
  // todo: layerconfig or text config?
  metadata?: Object;
}

export type AnnotationTarget = "gutter" | "span";
export type AnnotationLayerRenderType = "nested" | "flat";
