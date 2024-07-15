import { Annotation } from "@/types";
import { ActionType } from "@/types/AnnotatedText";

/**
 * Holds a state of all the annotations confirmed by the parent component.
 */
export class AnnotationsState {
  annotations: Map<string, Annotation>;

  constructor(annotations: Map<string, Annotation> = new Map()) {
    this.annotations = annotations;
  }

  /**
   * override the entire annotations state of the component
   * @param annotations map of annotations with ID string as key and annotation
   * objects as values
   */
  overrideAnnotations(annotations: Map<string, Annotation>) {
    this.annotations = annotations;
  }

  /**
   * Add or edit an annotation
   * @param annotation annotation object
   */
  editAnnotation(annotation: Annotation) {
    this.annotations.set(annotation.id, annotation);
  }

  /**
   * Remove an annotation
   * @param id id of the annotation to remove
   */
  removeAnnotation(id: string) {
    this.annotations.delete(id);
  }

  /**
   * Returns all annotations as an array.
   */
  getAnnotationsList(): Annotation[] {
    return Array.from(this.annotations.values());
  }
}

/**
 * Hold a state of an annotation currently being edited, not yet confirmed by
 * the parent component
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
    this.annotation.start = this.newStart;
    this.annotation.end = this.newEnd;
  }
}
