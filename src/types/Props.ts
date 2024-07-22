import { Annotation } from "@/types/Annotation";
import {
  ActionType,
  AnnotatedLine,
  AnnotationStyle,
  Line,
  RenderType,
  WordPart,
} from "@/types/AnnotatedText";

export interface AnnotatedTextProps {
  componentId: string;
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
  allowCreate?: boolean;
  listenToOnUpdateStart?: boolean;
  listenToOnUpdating?: boolean;
  listenToOnKeyPressed?: boolean;
  listenToOnCreateStart?: boolean;
  listenToOnCreating?: boolean;
}

export interface RecursiveAnnotatedTokenPartTextProps {
  componentId: string;
  text: string;
  start: number;
  end: number;
  annotations?: Annotation[];
  annotationClassHandler?: (
    annotation: Annotation,
    start: number,
    end: number,
    allowCreate: boolean
  ) => string[];
  onUpdateStart: (
    mouseEvent: MouseEvent,
    action: ActionType,
    wordPartStart: number,
    annotation: Annotation
  ) => void;
  annotationClickHandler: (annotation: Annotation) => void;
  wordPartStart: number; // for correct handle position
  allowEdit?: boolean;
  allowCreate?: boolean;
}

export interface AnnotatedLineProps {
  componentId: string;
  line: AnnotatedLine;
  wordPartClasses?: (wordPart: WordPart) => any[];
  render?: RenderType;
  annotationClasses?: (
    annotation: Annotation,
    start: number,
    end: number,
    allowCreate: boolean
  ) => string[];
  onClickAnnotation: (annotation: Annotation) => void;
  onMouseEnterLinePart: (wordPart: WordPart, mouseEvent: MouseEvent) => void;
  onStartCreate: (mouseEvent: MouseEvent, wordPartStart: number) => void;
  onUpdateStart: (
    mouseEvent: MouseEvent,
    action: ActionType,
    wordPartStart: number,
    annotation: Annotation
  ) => void;
  allowEdit?: boolean;
  allowCreate?: boolean;
}
