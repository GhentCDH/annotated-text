import { Annotation } from "./Annotation";

export interface AnnotatedTextProps {
  text: string;
  annotations?: Annotation[];
  lines?: Line[];
  annotationOffset?: number;
  debug?: boolean;
  theme?: string;
  render?: RenderType;
  showLabels?: boolean;
}

export type RenderType = "nested" | "flat";

export interface Line {
  text: string;
  start?: number;
  end?: number;
  gutter?: string;
}

export interface Paragraph {
  lines: Line[];
  start?: number;
  end?: number;
  gutter?: string;
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

type RangeWithAnnotation = [number, number, Annotation | null];
type RangeWithAnnotations = [number, number, Annotation[]];
