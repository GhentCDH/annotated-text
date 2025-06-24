import type { AnnotationInternal } from "./Annotation";
import type { Annotation, Line } from "../model";

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

export interface Text {
  paragraphs: Paragraph[];
}

interface WordPart {
  start: number;
  end: number;
  text: string;
  annotations: AnnotationInternal[];
  maxAnnotationWeight: number;
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

interface AnnotatedGutter {
  text: string;
  annotations: AnnotationInternal[];
}

interface AnnotatedLine {
  start: number;
  end: number;
  parts?: WordPart[];
  words?: AnnotatedWord[];
  gutter?: AnnotatedGutter;
}

type RangeWithAnnotation = [number, number, AnnotationInternal | null];
type RangeWithAnnotations = [number, number, AnnotationInternal[]];
