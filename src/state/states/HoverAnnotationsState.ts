import type { Annotation } from "src/types/Annotation";

/**
 * Holds all the annotations the mouse is currently hovering over.
 */
export class HoverAnnotationsState {
  hoveredAnnotations: Annotation[];
  mouseEvent: MouseEvent;

  constructor() {
    this.hoveredAnnotations = [];
    this.mouseEvent = null;
  }
}
