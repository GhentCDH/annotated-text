import { Annotation } from '../../types';
import { ActionType } from '../../types/AnnotatedText';
import { MouseEventPayload } from '../../types/Props';
export declare enum UserActionState {
    IDLE = "idle",
    SELECTING = "selecting",
    UPDATING = "updating",
    CREATING = "creating",
    START_SELECT = "start-selecting",
    START_CREATE = "start-creating"
}
/**
 * Holds the current user state in the component.
 */
export declare class UserState {
    state: UserActionState;
    payload: MouseEventPayload;
    constructor();
    reset(): void;
}
/**
 * Hold a state of an annotation currently being edited, not yet confirmed by
 * the parent component
 * @annotation deep copy of the being edited annotation
 */
export declare class UpdateAnnotationState {
    action: ActionType;
    handlePosition: number;
    annotation: Annotation;
    origAnnotation: Annotation;
    origEnd?: number;
    origStart?: number;
    newEnd: number;
    newStart: number;
    updating: boolean;
    userState: UserState;
    constructor(userState: UserState);
    /**
     * has to get called after an edit has been confirmed or denied.
     */
    resetUpdate(): void;
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
    startUpdating(action: ActionType, handlePosition: number, annotation: Annotation, origEnd: number | null, origStart: number | null, newEnd: number, newStart: number): void;
    /**
     * Should get called in order to confirm the initial state of the update.
     */
    confirmStartUpdating(): void;
    /**
     * Needs to be called by the parent component every time annotation-edit-moved
     * is emitted in order to confirm that edit. newStart and newEnd can be
     * edited before calling this in order to manipulate on what annotations have
     * to wrap.
     */
    confirmUpdate(): void;
}
/**
 * Holds all the annotations the mouse is currently hovering over.
 */
export declare class HoverAnnotationsState {
    hoveredAnnotations: Annotation[];
    mouseEvent: MouseEvent;
    constructor();
}
/**
 * Class holding the state of an annotation being created
 */
export declare class CreateAnnotationState {
    newEnd: number;
    newStart: number;
    annotation: Annotation;
    creating: boolean;
    userState: UserState;
    constructor(userState: UserState);
    /**
     * resets to the initial state
     */
    resetCreating(): void;
    /**
     * start creating an annotation
     * @param start position where the creation starts. The end position will not
     * be able to be before this starting position.
     */
    startCreating(start: number): void;
    /**
     * Initialise the annotation to be created.
     * @param annotation annotation object that the application can pass to use
     * as default init value.
     */
    initAnnotation(annotation: Annotation): void;
    /**
     * Has to be called every time the mouse moves a character when creating an
     * annotation. If the application does not listen to onMove updates the
     * component will do this automatically.
     */
    updateCreating(): void;
}
