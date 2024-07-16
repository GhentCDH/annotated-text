import { Annotation } from "@/types/Annotation";
import {
  AnnotatedLine,
  AnnotationStyle,
  Line,
  RenderType,
  WordPart,
} from "@/types/AnnotatedText";

export interface AnnotatedTextProps {
  text?: string;
  annotations?: Map<string, Annotation>;
  lines: Line[];
  annotationOffset?: number;
  debug?: boolean;
  theme?: string;
  render?: RenderType;
  showLabels?: boolean;
  autoAnnotationWeights?: boolean;
  style?: AnnotationStyle;
  allowEdit?: boolean;
  listenToOnEditMove?: boolean;
  listenToOnEditDone?: boolean;
  listenToOnKeyPressed?: boolean;
}

export interface RecursiveAnnotatedTokenPartTextProps {
  text: string;
  start: number;
  end: number;
  annotations?: Annotation[];
  annotationClassHandler?: (
    annotation: Annotation,
    start: number,
    end: number
  ) => string[];
  annotationClickHandler: (annotation: Annotation) => void;
  wordPartStart: number; // for correct handle position
  allowEdit?: boolean;
}

export interface AnnotatedLineProps {
  line: AnnotatedLine;
  wordPartClasses?: (wordPart: WordPart) => any[];
  render?: RenderType;
  annotationClasses?: (
    annotation: Annotation,
    start: number,
    end: number
  ) => string[];
  onClickAnnotation: (annotation: Annotation) => void;
  onMouseEnterLinePart: (wordPart: WordPart, mouseEvent: MouseEvent) => void;
  allowEdit?: boolean;
}
