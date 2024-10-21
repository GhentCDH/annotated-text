import type { AnnotationInternal } from "src/types/Annotation";

/**
 * Holds all the annotations the mouse is currently hovering over.
 */
export class HoverAnnotationsState {
  hoveredAnnotations: AnnotationInternal[];
  mouseEvent: MouseEvent;

  constructor() {
    this.hoveredAnnotations = [];
    this.mouseEvent = null;
  }
}
