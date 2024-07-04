import { Annotation } from "./Annotation";

export interface AnnotatedTextProps {
  text?: string;
  annotations?: Annotation[];
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
  text: string;
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

interface WordPart {
  start: number;
  end: number;
  text: string;
  annotations: Annotation[];
}

interface Word {
  start: number;
  end: number;
  text: string;
}

interface AnnotatedWord {
  start: number;
  end: number;
  text: string;
  parts: WordPart[];
}

interface AnnotatedLine {
  start: number;
  end: number;
  parts?: WordPart[];
  words?: AnnotatedWord[];
  gutter?: {
    text: string;
    annotations: Annotation[];
  };
}

type RangeWithAnnotation = [number, number, Annotation | null];
type RangeWithAnnotations = [number, number, Annotation[]];
