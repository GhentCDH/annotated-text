import type { Annotation } from "../../core";
import type { Snapper } from "../../core/adapter/text";

export interface AnnotatedTextV2Props {
  /**
   * If the selection should have another logic than character index selection, then add it here
   */
  useSnapper?: Snapper | undefined;
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
   * Text
   */
  text: string;
  /**
   * Whether verbose debug messages are printed
   */
  debug?: boolean;
  /**
   * Whether event messages are printed
   */
  verbose?: boolean;
  /**
   * Whether to allow editing annotations
   */
  allowEdit?: boolean;
  /**
   * Whether to allow creating new annotations
   */
  allowCreate?: boolean;
  /**
   * Right to left text direction
   */
  rtl?: boolean;
}
