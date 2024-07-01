import { Annotation, ExtendedAnnotation } from "./Annotation";

export interface AnnotatedTextProps {
  text?: string;
  annotations?: Annotation[];
  annotationLayers?: AnnotationLayer[];
  lines: Line[];
  annotationOffset?: number;
  debug?: boolean;
  theme?: string;
  render?: RenderType;
  showLabels?: boolean;
  autoAnnotationWeights?: boolean;
  style?: AnnotationStyle;
  allowEdit?: boolean;
}

export interface AnnotationLayer {
  annotations: Annotation[];
  visible: boolean;
  granularity: AnnotationGranularity;
  allowEdit?: boolean;
  allowDelete?: boolean;
  allowCreate?: boolean;
}

export enum AnnotationGranularity {
  Char = "char",
  SingleToken = "single_token",
  MultipleTokens = "multiple_tokens",
  Sentence = "sentence",
}

export interface AnnotationStyle {
  activeClass: string;
  startClass: string;
  endClass: string;
  weightClass: string;
  transitioningClass: string;
}

export interface AnnotationActionPayload {
  action: "moveStart" | "moveEnd" | "move";
  annotation?: Annotation;
  handlePosition?: string;
}

export interface AnnotationActionState extends AnnotationActionPayload {
  origStart?: number;
  origEnd?: number;
  newStart?: number;
  newEnd?: number;
}

export type RenderType = "nested" | "flat";

export interface Paragraph {
  lines: Line[];
  start?: number;
  end?: number;
  gutter?: string;
}

export interface Line {
  text: string | Token[];
  start: number;
  end: number;
  gutter?: string;
}

export interface Token {
  text: string;
  start: number;
  end: number;
}
export interface Text {
  paragraphs: Paragraph[];
}

interface LinePart {
  start: number;
  end: number;
  text: string;
  annotations: Annotation[];
}

interface AnnotatedLine {
  start: number;
  end: number;
  parts: LinePart[];
  gutter?: {
    text: string;
    annotations: Annotation[];
  };
}

type RangeWithAnnotation = [number, number, ExtendedAnnotation | null];
type RangeWithAnnotations = [number, number, ExtendedAnnotation[]];
