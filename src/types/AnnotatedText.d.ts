import { Annotation } from "./Annotation";

export interface AnnotationStyle {
  defaultClass: string;
  activeClass: string;
  startClass: string;
  endClass: string;
  weightClass: string;
  transitioningClass: string;
  shadowClass: string;
  hoveredClass: string;
}

export interface AnnotationActionPayload {
  action: ActionType;
  annotation?: Annotation;
  handlePosition?: number;
}

export type ActionType = "moveStart" | "moveEnd" | "move";

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
