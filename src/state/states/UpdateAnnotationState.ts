import { cloneDeep } from "lodash-es";
import type { UserState } from "./UserState";
import type { AnnotationInternal } from "../../types/Annotation";
import { UserActionState } from "../types/UserActionState.enum";
import type { ActionType } from "../../types/AnnotatedText";

/**
 * Hold a state of an annotation currently being edited, not yet confirmed by
 * the parent component
 * @annotation deep copy of the being edited annotation
 */
export class UpdateAnnotationState {
  action: ActionType;
  handlePosition: number;
  annotation: AnnotationInternal;
  origAnnotation: AnnotationInternal;
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
    this.userState.state = UserActionState.IDLE;
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
    annotation: AnnotationInternal,
    origEnd: number | null = null,
    origStart: number | null = null,
    newEnd: number,
    newStart: number,
  ) {
    this.action = action;
    this.handlePosition = handlePosition;
    this.origAnnotation = annotation;
    this.annotation = cloneDeep(annotation);
    this.origEnd = origEnd;
    this.origStart = origStart;
    this.newEnd = newEnd;
    this.newStart = newStart;
  }

  /**
   * Should get called in order to confirm the initial state of the update.
   */
  confirmStartUpdating() {
    this.userState.state = UserActionState.UPDATING;
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

  getAnnotation() {
    return cloneDeep(this.annotation);
  }
}
