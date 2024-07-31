import { Annotation } from "@/types";
import { ActionType } from "@/types/AnnotatedText";

export enum UserActionState {
  IDLE,
  UPDATING,
  CREATING,
}

/**
 * Holds the current user state in the component.
 */
export class UserState {
  value: UserActionState;

  constructor() {
    this.value = UserActionState.IDLE;
  }
}

/**
 * Hold a state of an annotation currently being edited, not yet confirmed by
 * the parent component
 * @annotation deep copy of the being edited annotation
 */
export class UpdateAnnotationState {
  action: ActionType;
  handlePosition: number;
  annotation: Annotation;
  origAnnotation: Annotation;
  origEnd?: number;
  origStart?: number;
  newEnd: number;
  newStart: number;
  updating: boolean = false;
  userState: UserState;

  constructor(userState: UserState) {
    this.userState = userState;
    this.resetUpdate();
  }

  /**
   * has to get called after an edit has been confirmed or denied.
   */
  resetUpdate() {
    this.action = null;
    this.handlePosition = null;
    this.annotation = null;
    this.origAnnotation = null;
    this.origEnd = null;
    this.origStart = null;
    this.newEnd = null;
    this.newStart = null;
    this.updating = false;
    this.userState.value = UserActionState.IDLE;
    this.updating = false;
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
  startUpdating(
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
    this.annotation.tmpClass = "";
    this.origEnd = origEnd;
    this.origStart = origStart;
    this.newEnd = newEnd;
    this.newStart = newStart;
  }

  /**
   * Should get called in order to confirm the initial state of the update.
   */
  confirmStartUpdating() {
    this.updating = true;
    this.confirmUpdate();
  }

  /**
   * Needs to be called by the parent component every time annotation-edit-moved
   * is emitted in order to confirm that edit. newStart and newEnd can be
   * edited before calling this in order to manipulate on what annotations have
   * to wrap.
   */
  confirmUpdate() {
    if (this.updating) {
      this.annotation.start = this.newStart;
      this.annotation.end = this.newEnd;
    }
  }
}

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

/**
 * Class holding the state of an annotation being created
 */
export class CreateAnnotationState {
  newEnd: number;
  newStart: number;
  annotation: Annotation;
  creating: boolean;
  userState: UserState;

  constructor(userState: UserState) {
    this.userState = userState;
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
    this.creating = false;
    this.userState.value = UserActionState.IDLE;
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
