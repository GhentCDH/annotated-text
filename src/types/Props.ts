import { Annotation, AnnotationTarget } from "@/types/Annotation";
import {
  ActionType,
  AnnotatedLine,
  AnnotationStyle,
  Line,
  RenderType,
  WordPart,
} from "@/types/AnnotatedText";

export interface AnnotatedTextProps {
  /**
   * List of annotations to be displayed
   */
  annotations?: Annotation[];
  /**
   * List of annotation ID's that are selected. Those will get the "active" style class
   */
  selectedAnnotations?: string[];
  /**
   * List of annotation ID's that are hovered. Those will get the "hovered" style class.
   */
  hoveredAnnotations?: string[];
  /**
   * List of lines
   */
  lines: Line[];
  /**
   * @deprecated
   */
  annotationOffset?: number;
  /**
   * Whether verbose debug messages are printed
   */
  debug?: boolean;
  /**
   * Whether event messages are printed
   */
  verbose?: boolean;
  /**
   * only default theme available for now
   */
  theme?: string;
  /**
   * @deprecated
   */
  render?: RenderType;
  /**
   * Whether to display text or gutter annotations
   */
  display?: AnnotationTarget;
  /**
   * Whether to show the labels
   */
  showLabels?: boolean;
  /**
   * Whether to automatically calculate weights
   */
  autoAnnotationWeights?: boolean;
  /**
   * Object to define classes for styles.
   */
  style?: AnnotationStyle;
  /**
   * Whether to allow editing annotations
   */
  allowEdit?: boolean;
  /**
   * Whether to allow creating new annotations
   */
  allowCreate?: boolean;
  /**
   * Whether you are listening to the onUpdateStart emit or not. If false default behaviour will be used.
   */
  listenToOnUpdateStart?: boolean;
  /**
   * Whether you are listening to the onUpdating emit or not. If false default behaviour will be used.
   */
  listenToOnUpdating?: boolean;
  /**
   * Whether you are listening to the onKeyPressed emit or not. If false default behaviour will be used.
   */
  listenToOnKeyPressed?: boolean;
  /**
   * Whether you are listening to the onCreateStart emit or not. If false default behaviour will be used.
   */
  listenToOnCreateStart?: boolean;
  /**
   * Whether you are listening to the onCreating emit or not. If false default behaviour will be used.
   */
  listenToOnCreating?: boolean;
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
    allowCreate: boolean
  ) => string[];
  wordPartStart: number; // for correct handle position
  allowEdit?: boolean;
  allowCreate?: boolean;

  mouseDownHandler: (e: MouseEvent, payload?: MouseEventPayload) => void;
  mouseMoveHandler: (e: MouseEvent, payload?: MouseEventPayload) => void;
}

export interface AnnotatedLineProps {
  line: AnnotatedLine;
  wordPartClasses?: (wordPart: WordPart) => any[];
  render?: RenderType;
  annotationClasses?: (
    annotation: Annotation,
    start: number,
    end: number,
    allowCreate: boolean
  ) => string[];
  allowEdit?: boolean;
  allowCreate?: boolean;

  mouseDownHandler: (e: MouseEvent, payload?: MouseEventPayload) => void;
  mouseMoveHandler: (e: MouseEvent, payload?: MouseEventPayload) => void;
}

export interface MouseEventPayload {
  startOffset: number;
  annotation?: Annotation;
  action?: string;
}