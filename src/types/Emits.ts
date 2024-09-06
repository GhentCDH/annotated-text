import { Annotation } from "@/types/Annotation";
import {
  CreateAnnotationState,
  UpdateAnnotationState,
  UserActionState,
  UserState,
} from "@/lib/annotatedTextUtils";

export interface AnnotatedTextEmits {
  /**
   * Emitted when an annotation (both span and gutter) is clicked.
   * @arg annotation Annotation object that was clicked
   * @arg mouseEvent normal dom mouse event
   */
  "annotation-select": [annotation: Annotation, mouseEvent: MouseEvent];
  /**
   * Emitted when the user starts updating an annotation, so when the mouse is
   * clicked down and the listenToOnUpdateStart prop is true.
   *
   * The newStart and newEnd fields of the updateState can be edited.
   *
   * updateState.confirmStartUpdating should be called in order to confirm
   * the start of the update
   * @arg updateState object holding the state of the update
   */
  "annotation-update-begin": [updateState: UpdateAnnotationState];
  /**
   * Emitted every time the user moves their cursor while updating an
   * annotation. Only emitted if the listenToOnUpdating prop is true.
   *
   * The newStart and newEnd fields of the updateState can be edited.
   *
   * updateState.confirmUpdate should be called in order to confirm the new
   * position after the mouse move.
   * @arg updateState object holding the state of the update
   */
  "annotation-updating": [updateState: UpdateAnnotationState];
  /**
   * Emitted when during an update the mouse is released.
   *
   * @arg updateState updateState object containing the new annotation object in the annotation field.
   *
   */
  "annotation-update-end": [updateState: UpdateAnnotationState];
  /**
   * Emitted when the mouse is pressed down on plain text.
   *
   * If listening to this emit, createState.initAnnotation should be called to initialize the new annotation being created.
   *
   * @arg createState object holding the state of the being created annotation
   */
  "annotation-create-begin": [createState: CreateAnnotationState];
  /**
   * Emitted on every mouse move while creating an annotation.
   *
   * The newEnd and newStart fields of the createState object can be edited.
   *
   * createState.updateCreating needs to be called to confirm the new position after the mouse move.
   *
   * @arg createState object holding the state of the being created annotation
   */
  "annotation-creating": [createState: CreateAnnotationState];
  /**
   * Emitted when during creation the mouse is released.
   *
   * @arg createState object holding the state of the being created annotation. The annotation field holds the newly created annotation.
   */
  "annotation-create-end": [createState: CreateAnnotationState];
  /**
   * Emitted whenever any key is pressed. Can be used to reset updating or creating states
   *
   * @arg keyEvent key event object
   * @arg updateState {UpdateAnnotationState}
   * @arg createState {CreateAnnotationState}
   * @arg userState {UserState}
   */
  "key-pressed": [
    keyEvent: KeyboardEvent,
    updateState: UpdateAnnotationState,
    createState: CreateAnnotationState,
    userState: UserState
  ];
  /**
   * Emitted when the mouse goes over new annotations
   * @arg hoveredAnnotations List newly hovered annotations
   * @arg mouseEvent Normal dom mouse event
   */
  "annotation-mouse-over": [
    hoveredAnnotations: Annotation[],
    mouseEvent: MouseEvent
  ];
  /**
   * Emitted when the mouse stops hovering over annotations
   * @arg hoveredAnnotations List of now newly no longer hovered annotations
   * @arg mouseEvent Normal dom mouse event
   */
  "annotation-mouse-leave": [
    hoveredAnnotations: Annotation[],
    mouseEvent: MouseEvent
  ];
  /**
   * Emitted whenever the internal user state changes
   * @arg oldState Old user action state
   * @arg newState New user action state
   */
  "user-action-state-change": [
    oldState: UserActionState,
    newState: UserActionState
  ];
}
