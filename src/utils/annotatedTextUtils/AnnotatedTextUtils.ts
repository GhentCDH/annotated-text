import { annotationClasses } from "./AnnotatedTextUtils/annotation.classes";
import type { UpdateAnnotationState } from "../../state";
import type { AnnotationInternal } from "../../types/Annotation";

import type { AnnotationStyle } from "../../types/AnnotatedText";

export type CssClassUtilProps = {
  /**
   * Object to define classes for styles.
   */
  style?: AnnotationStyle;
  /**
   * Whether to show the labels
   */
  showLabels?: boolean;
  /**
   * List of annotation ID's that are selected. Those will get the "active" style class
   */
  selectedAnnotations?: string[];
  /**
   * List of annotation ID's that are hovered. Those will get the "hovered" style class.
   */
  hoveredAnnotations?: string[];
};

export class CssClassesUtil<P extends CssClassUtilProps> {
  props: P;
  editAnnotationState: UpdateAnnotationState;

  constructor(props: P, editingAnnotation: UpdateAnnotationState) {
    this.props = props;
    this.editAnnotationState = editingAnnotation;
  }

  annotationClasses = (
    annotation: AnnotationInternal,
    start: number,
    end: number,
    allowCreate: boolean,
  ): string[] => {
    const { style, selectedAnnotations, hoveredAnnotations } = this.props;

    return annotationClasses(
      annotation,
      this.editAnnotationState.annotation,
      style,
      start,
      end,
      allowCreate,
      selectedAnnotations,
      hoveredAnnotations,
    );
  };
}
