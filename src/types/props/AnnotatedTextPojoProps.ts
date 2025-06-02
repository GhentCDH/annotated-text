import type { Annotation } from "../Annotation";
import type { Line } from "../AnnotatedText";

export interface AnnotatedTextPojoProps {
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
  highlightAnnotations?: string[];
  /**
   * List of lines
   */
  textLines: Line[];
  /**
   * @deprecated
   */
  // annotationOffset?: number;
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
  // theme?: string;
  /**
   * @deprecated
   */
  // render?: RenderType;
  /**
   * Whether to display text or gutter annotations
   */
  // display?: AnnotationTarget;
  /**
   * Whether to show the labels
   */
  // showLabels?: boolean;
  /**
   * Whether to automatically calculate weights
   */
  // autoAnnotationWeights?: boolean;
  /**
   * Object to define classes for styles.
   */
  // style?: AnnotationStyle;
  /**
   * Whether to allow editing annotations
   */
  // allowEdit?: boolean;
  /**
   * Whether to allow creating new annotations
   */
  // allowCreate?: boolean;
}
