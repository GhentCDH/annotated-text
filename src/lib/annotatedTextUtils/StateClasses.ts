import { Annotation } from "@/types";
import { ActionType } from "@/types/AnnotatedText";

/**
 * Hold a state of an annotation currently being edited, not yet confirmed by
 * the parent component
 * @annotation deep copy of the being edited annotation
 */
export class EditAnnotationState {
  action: ActionType;
  handlePosition: number;
  annotation: Annotation;
  origAnnotation: Annotation;
  origEnd?: number;
  origStart?: number;
  newEnd: number;
  newStart: number;
  editing: boolean = false;

  constructor() {
    this.resetEdit();
  }

  /**
   * has to get called after an edit has been confirmed or denied.
   */
  resetEdit() {
    this.action = null;
    this.handlePosition = null;
    this.annotation = null;
    this.origAnnotation = null;
    this.origEnd = null;
    this.origStart = null;
    this.newEnd = null;
    this.newStart = null;
    this.editing = false;
  }

  /**
   * Gets called by the component when an edit it started. Should generally not
   * be called by the parent component.
   * @param action
   * @param handlePosition
   * @param annotation
   * @param origEnd
   * @param origStart
   * @param newEnd
   * @param newStart
   */
  startEditing(
    action: ActionType,
    handlePosition: number,
    annotation: Annotation,
    origEnd: number | null = null,
    origStart: number | null = null,
    newEnd: number,
    newStart: number
  ) {
    this.action = action;
    this.handlePosition = handlePosition;
    this.origAnnotation = annotation;
    this.annotation = JSON.parse(JSON.stringify(annotation));
    this.origEnd = origEnd;
    this.origStart = origStart;
    this.newEnd = newEnd;
    this.newStart = newStart;
    this.editing = true;
  }

  /**
   * Needs to be called by the parent component every time annotation-edit-moved
   * is emitted in order to confirm that edit. newStart and newEnd can be
   * edited before calling this in order to manipulate on what annotations have
   * to wrap.
   */
  confirmEdit() {
    if (this.editing) {
      this.annotation.start = this.newStart;
      this.annotation.end = this.newEnd;
    }
  }
}

export class HoverAnnotationsState {
  hoveredAnnotations: Annotation[];
  editingAnnotation: Annotation;

  constructor() {
    this.hoveredAnnotations = [];
    this.editingAnnotation = null;
  }

  setEditingAnnotation(annotation: Annotation) {
    this.editingAnnotation = JSON.parse(JSON.stringify(annotation));
  }

  resetEditingAnnotation() {
    this.editingAnnotation = null;
  }
}

/**
 * Class holding the state of an annotation being created
 */
export class CreateAnnotationState {
  newEnd: number;
  newStart: number;
  annotation: Annotation;
  creating: boolean;

  constructor() {
    this.resetCreating();
  }

  /**
   * resets to the initial state
   */
  resetCreating() {
    this.creating = false;
    this.annotation = null;
    this.newEnd = null;
    this.newStart = null;
  }

  /**
   * start creating an annotation
   * @param start position where the creation starts. The end position will not
   * be able to be before this starting position.
   */
  startCreating(start: number) {
    this.creating = true;
    this.newStart = start;
    this.newEnd = start;
  }

  /**
   * Initialise the annotation to be created.
   * @param annotation annotation object that the application can pass to use
   * as default init value.
   */
  initAnnotation(annotation: Annotation) {
    this.annotation = annotation;
    this.annotation.start = this.newStart;
    this.annotation.end = this.newEnd;
  }

  /**
   * Has to be called every time the mouse moves a character when creating an
   * annotation. If the application does not listen to onMove updates the
   * component will do this automatically.
   */
  updateCreating() {
    this.annotation.start = this.newStart;
    this.annotation.end = this.newEnd;
  }
}
