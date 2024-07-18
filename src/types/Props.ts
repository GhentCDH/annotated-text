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
  allowCreate?: boolean;
  listenToOnEditMove?: boolean;
  listenToOnKeyPressed?: boolean;
  listenToOnCreateStart?: boolean;
  listenToOnCreateMove?: boolean;
}

export interface RecursiveAnnotatedTokenPartTextProps {
  text: string;
  start: number;
  end: number;
  annotations?: Annotation[];
  annotationClassHandler?: (
    annotation: Annotation,
    start: number,
    end: number,
    allowCreate: boolean,
  ) => string[];
  annotationClickHandler: (annotation: Annotation) => void;
  wordPartStart: number; // for correct handle position
  allowEdit?: boolean;
  allowCreate?: boolean;
}

export interface AnnotatedLineProps {
  line: AnnotatedLine;
  wordPartClasses?: (wordPart: WordPart) => any[];
  render?: RenderType;
  annotationClasses?: (
    annotation: Annotation,
    start: number,
    end: number,
    allowCreate: boolean,
  ) => string[];
  onClickAnnotation: (annotation: Annotation) => void;
  onMouseEnterLinePart: (wordPart: WordPart, mouseEvent: MouseEvent) => void;
  onStartCreate: (mouseEvent: MouseEvent, wordPartStart: number) => void;
  allowEdit?: boolean;
  allowCreate?: boolean;
}
