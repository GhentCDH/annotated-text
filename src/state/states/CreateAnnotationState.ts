import type { UserState } from "./UserState";
import type { AnnotationInternal } from "../../types/Annotation";
import { UserActionState } from "../types/UserActionState.enum";

/**
 * Class holding the state of an annotation being created
 */
export class CreateAnnotationState {
  newEnd: number;
  newStart: number;
  annotation: AnnotationInternal;
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
    this.userState.state = UserActionState.IDLE;
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
  initAnnotation(annotation: AnnotationInternal) {
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
