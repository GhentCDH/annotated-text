import { CreateAnnotationState, UpdateAnnotationState, HoverAnnotationsState, UserState } from '../lib/annotatedTextUtils/StateClasses';
export declare const useStateObjectsStore: (componentId: string) => import("pinia").StoreDefinition<`stateObjects-${string}`, import("pinia")._UnwrapAll<Pick<{
    updateState: import("vue").Ref<{
        action: import("../types/AnnotatedText").ActionType;
        handlePosition: number;
        annotation: {
            id: string;
            start: number;
            end: number;
            text?: string;
            class?: string;
            tmpClass?: string;
            label?: string;
            target: import("..").AnnotationTarget;
            weight?: number;
            active?: boolean;
            visible?: boolean;
        };
        origAnnotation: {
            id: string;
            start: number;
            end: number;
            text?: string;
            class?: string;
            tmpClass?: string;
            label?: string;
            target: import("..").AnnotationTarget;
            weight?: number;
            active?: boolean;
            visible?: boolean;
        };
        origEnd?: number;
        origStart?: number;
        newEnd: number;
        newStart: number;
        updating: boolean;
        userState: {
            state: import('../lib/annotatedTextUtils/StateClasses').UserActionState;
            payload: {
                startOffset: number;
                annotation?: {
                    id: string;
                    start: number;
                    end: number;
                    text?: string;
                    class?: string;
                    tmpClass?: string;
                    label?: string;
                    target: import("..").AnnotationTarget;
                    weight?: number;
                    active?: boolean;
                    visible?: boolean;
                };
                action?: string;
            };
            reset: () => void;
        };
        resetUpdate: () => void;
        startUpdating: (action: import("../types/AnnotatedText").ActionType, handlePosition: number, annotation: import("..").Annotation, origEnd: number, origStart: number, newEnd: number, newStart: number) => void;
        confirmStartUpdating: () => void;
        confirmUpdate: () => void;
    }, UpdateAnnotationState | {
        action: import("../types/AnnotatedText").ActionType;
        handlePosition: number;
        annotation: {
            id: string;
            start: number;
            end: number;
            text?: string;
            class?: string;
            tmpClass?: string;
            label?: string;
            target: import("..").AnnotationTarget;
            weight?: number;
            active?: boolean;
            visible?: boolean;
        };
        origAnnotation: {
            id: string;
            start: number;
            end: number;
            text?: string;
            class?: string;
            tmpClass?: string;
            label?: string;
            target: import("..").AnnotationTarget;
            weight?: number;
            active?: boolean;
            visible?: boolean;
        };
        origEnd?: number;
        origStart?: number;
        newEnd: number;
        newStart: number;
        updating: boolean;
        userState: {
            state: import('../lib/annotatedTextUtils/StateClasses').UserActionState;
            payload: {
                startOffset: number;
                annotation?: {
                    id: string;
                    start: number;
                    end: number;
                    text?: string;
                    class?: string;
                    tmpClass?: string;
                    label?: string;
                    target: import("..").AnnotationTarget;
                    weight?: number;
                    active?: boolean;
                    visible?: boolean;
                };
                action?: string;
            };
            reset: () => void;
        };
        resetUpdate: () => void;
        startUpdating: (action: import("../types/AnnotatedText").ActionType, handlePosition: number, annotation: import("..").Annotation, origEnd: number, origStart: number, newEnd: number, newStart: number) => void;
        confirmStartUpdating: () => void;
        confirmUpdate: () => void;
    }>;
    createState: import("vue").Ref<{
        newEnd: number;
        newStart: number;
        annotation: {
            id: string;
            start: number;
            end: number;
            text?: string;
            class?: string;
            tmpClass?: string;
            label?: string;
            target: import("..").AnnotationTarget;
            weight?: number;
            active?: boolean;
            visible?: boolean;
        };
        creating: boolean;
        userState: {
            state: import('../lib/annotatedTextUtils/StateClasses').UserActionState;
            payload: {
                startOffset: number;
                annotation?: {
                    id: string;
                    start: number;
                    end: number;
                    text?: string;
                    class?: string;
                    tmpClass?: string;
                    label?: string;
                    target: import("..").AnnotationTarget;
                    weight?: number;
                    active?: boolean;
                    visible?: boolean;
                };
                action?: string;
            };
            reset: () => void;
        };
        resetCreating: () => void;
        startCreating: (start: number) => void;
        initAnnotation: (annotation: import("..").Annotation) => void;
        updateCreating: () => void;
    }, CreateAnnotationState | {
        newEnd: number;
        newStart: number;
        annotation: {
            id: string;
            start: number;
            end: number;
            text?: string;
            class?: string;
            tmpClass?: string;
            label?: string;
            target: import("..").AnnotationTarget;
            weight?: number;
            active?: boolean;
            visible?: boolean;
        };
        creating: boolean;
        userState: {
            state: import('../lib/annotatedTextUtils/StateClasses').UserActionState;
            payload: {
                startOffset: number;
                annotation?: {
                    id: string;
                    start: number;
                    end: number;
                    text?: string;
                    class?: string;
                    tmpClass?: string;
                    label?: string;
                    target: import("..").AnnotationTarget;
                    weight?: number;
                    active?: boolean;
                    visible?: boolean;
                };
                action?: string;
            };
            reset: () => void;
        };
        resetCreating: () => void;
        startCreating: (start: number) => void;
        initAnnotation: (annotation: import("..").Annotation) => void;
        updateCreating: () => void;
    }>;
    hoverState: import("vue").Ref<{
        hoveredAnnotations: {
            id: string;
            start: number;
            end: number;
            text?: string;
            class?: string;
            tmpClass?: string;
            label?: string;
            target: import("..").AnnotationTarget;
            weight?: number;
            active?: boolean;
            visible?: boolean;
        }[];
        mouseEvent: {
            readonly altKey: boolean;
            readonly button: number;
            readonly buttons: number;
            readonly clientX: number;
            readonly clientY: number;
            readonly ctrlKey: boolean;
            readonly metaKey: boolean;
            readonly movementX: number;
            readonly movementY: number;
            readonly offsetX: number;
            readonly offsetY: number;
            readonly pageX: number;
            readonly pageY: number;
            readonly relatedTarget: {
                addEventListener: (type: string, callback: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions) => void;
                dispatchEvent: (event: Event) => boolean;
                removeEventListener: (type: string, callback: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions) => void;
            };
            readonly screenX: number;
            readonly screenY: number;
            readonly shiftKey: boolean;
            readonly x: number;
            readonly y: number;
            getModifierState: (keyArg: string) => boolean;
            initMouseEvent: (typeArg: string, canBubbleArg: boolean, cancelableArg: boolean, viewArg: Window, detailArg: number, screenXArg: number, screenYArg: number, clientXArg: number, clientYArg: number, ctrlKeyArg: boolean, altKeyArg: boolean, shiftKeyArg: boolean, metaKeyArg: boolean, buttonArg: number, relatedTargetArg: EventTarget) => void;
            readonly detail: number;
            readonly view: Window;
            readonly which: number;
            initUIEvent: (typeArg: string, bubblesArg?: boolean, cancelableArg?: boolean, viewArg?: Window, detailArg?: number) => void;
            readonly bubbles: boolean;
            cancelBubble: boolean;
            readonly cancelable: boolean;
            readonly composed: boolean;
            readonly currentTarget: {
                addEventListener: (type: string, callback: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions) => void;
                dispatchEvent: (event: Event) => boolean;
                removeEventListener: (type: string, callback: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions) => void;
            };
            readonly defaultPrevented: boolean;
            readonly eventPhase: number;
            readonly isTrusted: boolean;
            returnValue: boolean;
            readonly srcElement: {
                addEventListener: (type: string, callback: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions) => void;
                dispatchEvent: (event: Event) => boolean;
                removeEventListener: (type: string, callback: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions) => void;
            };
            readonly target: {
                addEventListener: (type: string, callback: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions) => void;
                dispatchEvent: (event: Event) => boolean;
                removeEventListener: (type: string, callback: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions) => void;
            };
            readonly timeStamp: number;
            readonly type: string;
            composedPath: () => EventTarget[];
            initEvent: (type: string, bubbles?: boolean, cancelable?: boolean) => void;
            preventDefault: () => void;
            stopImmediatePropagation: () => void;
            stopPropagation: () => void;
            readonly NONE: 0;
            readonly CAPTURING_PHASE: 1;
            readonly AT_TARGET: 2;
            readonly BUBBLING_PHASE: 3;
        };
    }, HoverAnnotationsState | {
        hoveredAnnotations: {
            id: string;
            start: number;
            end: number;
            text?: string;
            class?: string;
            tmpClass?: string;
            label?: string;
            target: import("..").AnnotationTarget;
            weight?: number;
            active?: boolean;
            visible?: boolean;
        }[];
        mouseEvent: {
            readonly altKey: boolean;
            readonly button: number;
            readonly buttons: number;
            readonly clientX: number;
            readonly clientY: number;
            readonly ctrlKey: boolean;
            readonly metaKey: boolean;
            readonly movementX: number;
            readonly movementY: number;
            readonly offsetX: number;
            readonly offsetY: number;
            readonly pageX: number;
            readonly pageY: number;
            readonly relatedTarget: {
                addEventListener: (type: string, callback: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions) => void;
                dispatchEvent: (event: Event) => boolean;
                removeEventListener: (type: string, callback: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions) => void;
            };
            readonly screenX: number;
            readonly screenY: number;
            readonly shiftKey: boolean;
            readonly x: number;
            readonly y: number;
            getModifierState: (keyArg: string) => boolean;
            initMouseEvent: (typeArg: string, canBubbleArg: boolean, cancelableArg: boolean, viewArg: Window, detailArg: number, screenXArg: number, screenYArg: number, clientXArg: number, clientYArg: number, ctrlKeyArg: boolean, altKeyArg: boolean, shiftKeyArg: boolean, metaKeyArg: boolean, buttonArg: number, relatedTargetArg: EventTarget) => void;
            readonly detail: number;
            readonly view: Window;
            readonly which: number;
            initUIEvent: (typeArg: string, bubblesArg?: boolean, cancelableArg?: boolean, viewArg?: Window, detailArg?: number) => void;
            readonly bubbles: boolean;
            cancelBubble: boolean;
            readonly cancelable: boolean;
            readonly composed: boolean;
            readonly currentTarget: {
                addEventListener: (type: string, callback: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions) => void;
                dispatchEvent: (event: Event) => boolean;
                removeEventListener: (type: string, callback: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions) => void;
            };
            readonly defaultPrevented: boolean;
            readonly eventPhase: number;
            readonly isTrusted: boolean;
            returnValue: boolean;
            readonly srcElement: {
                addEventListener: (type: string, callback: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions) => void;
                dispatchEvent: (event: Event) => boolean;
                removeEventListener: (type: string, callback: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions) => void;
            };
            readonly target: {
                addEventListener: (type: string, callback: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions) => void;
                dispatchEvent: (event: Event) => boolean;
                removeEventListener: (type: string, callback: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions) => void;
            };
            readonly timeStamp: number;
            readonly type: string;
            composedPath: () => EventTarget[];
            initEvent: (type: string, bubbles?: boolean, cancelable?: boolean) => void;
            preventDefault: () => void;
            stopImmediatePropagation: () => void;
            stopPropagation: () => void;
            readonly NONE: 0;
            readonly CAPTURING_PHASE: 1;
            readonly AT_TARGET: 2;
            readonly BUBBLING_PHASE: 3;
        };
    }>;
    userState: import("vue").Ref<{
        state: import('../lib/annotatedTextUtils/StateClasses').UserActionState;
        payload: {
            startOffset: number;
            annotation?: {
                id: string;
                start: number;
                end: number;
                text?: string;
                class?: string;
                tmpClass?: string;
                label?: string;
                target: import("..").AnnotationTarget;
                weight?: number;
                active?: boolean;
                visible?: boolean;
            };
            action?: string;
        };
        reset: () => void;
    }, UserState | {
        state: import('../lib/annotatedTextUtils/StateClasses').UserActionState;
        payload: {
            startOffset: number;
            annotation?: {
                id: string;
                start: number;
                end: number;
                text?: string;
                class?: string;
                tmpClass?: string;
                label?: string;
                target: import("..").AnnotationTarget;
                weight?: number;
                active?: boolean;
                visible?: boolean;
            };
            action?: string;
        };
        reset: () => void;
    }>;
}, "userState" | "updateState" | "createState" | "hoverState">>, Pick<{
    updateState: import("vue").Ref<{
        action: import("../types/AnnotatedText").ActionType;
        handlePosition: number;
        annotation: {
            id: string;
            start: number;
            end: number;
            text?: string;
            class?: string;
            tmpClass?: string;
            label?: string;
            target: import("..").AnnotationTarget;
            weight?: number;
            active?: boolean;
            visible?: boolean;
        };
        origAnnotation: {
            id: string;
            start: number;
            end: number;
            text?: string;
            class?: string;
            tmpClass?: string;
            label?: string;
            target: import("..").AnnotationTarget;
            weight?: number;
            active?: boolean;
            visible?: boolean;
        };
        origEnd?: number;
        origStart?: number;
        newEnd: number;
        newStart: number;
        updating: boolean;
        userState: {
            state: import('../lib/annotatedTextUtils/StateClasses').UserActionState;
            payload: {
                startOffset: number;
                annotation?: {
                    id: string;
                    start: number;
                    end: number;
                    text?: string;
                    class?: string;
                    tmpClass?: string;
                    label?: string;
                    target: import("..").AnnotationTarget;
                    weight?: number;
                    active?: boolean;
                    visible?: boolean;
                };
                action?: string;
            };
            reset: () => void;
        };
        resetUpdate: () => void;
        startUpdating: (action: import("../types/AnnotatedText").ActionType, handlePosition: number, annotation: import("..").Annotation, origEnd: number, origStart: number, newEnd: number, newStart: number) => void;
        confirmStartUpdating: () => void;
        confirmUpdate: () => void;
    }, UpdateAnnotationState | {
        action: import("../types/AnnotatedText").ActionType;
        handlePosition: number;
        annotation: {
            id: string;
            start: number;
            end: number;
            text?: string;
            class?: string;
            tmpClass?: string;
            label?: string;
            target: import("..").AnnotationTarget;
            weight?: number;
            active?: boolean;
            visible?: boolean;
        };
        origAnnotation: {
            id: string;
            start: number;
            end: number;
            text?: string;
            class?: string;
            tmpClass?: string;
            label?: string;
            target: import("..").AnnotationTarget;
            weight?: number;
            active?: boolean;
            visible?: boolean;
        };
        origEnd?: number;
        origStart?: number;
        newEnd: number;
        newStart: number;
        updating: boolean;
        userState: {
            state: import('../lib/annotatedTextUtils/StateClasses').UserActionState;
            payload: {
                startOffset: number;
                annotation?: {
                    id: string;
                    start: number;
                    end: number;
                    text?: string;
                    class?: string;
                    tmpClass?: string;
                    label?: string;
                    target: import("..").AnnotationTarget;
                    weight?: number;
                    active?: boolean;
                    visible?: boolean;
                };
                action?: string;
            };
            reset: () => void;
        };
        resetUpdate: () => void;
        startUpdating: (action: import("../types/AnnotatedText").ActionType, handlePosition: number, annotation: import("..").Annotation, origEnd: number, origStart: number, newEnd: number, newStart: number) => void;
        confirmStartUpdating: () => void;
        confirmUpdate: () => void;
    }>;
    createState: import("vue").Ref<{
        newEnd: number;
        newStart: number;
        annotation: {
            id: string;
            start: number;
            end: number;
            text?: string;
            class?: string;
            tmpClass?: string;
            label?: string;
            target: import("..").AnnotationTarget;
            weight?: number;
            active?: boolean;
            visible?: boolean;
        };
        creating: boolean;
        userState: {
            state: import('../lib/annotatedTextUtils/StateClasses').UserActionState;
            payload: {
                startOffset: number;
                annotation?: {
                    id: string;
                    start: number;
                    end: number;
                    text?: string;
                    class?: string;
                    tmpClass?: string;
                    label?: string;
                    target: import("..").AnnotationTarget;
                    weight?: number;
                    active?: boolean;
                    visible?: boolean;
                };
                action?: string;
            };
            reset: () => void;
        };
        resetCreating: () => void;
        startCreating: (start: number) => void;
        initAnnotation: (annotation: import("..").Annotation) => void;
        updateCreating: () => void;
    }, CreateAnnotationState | {
        newEnd: number;
        newStart: number;
        annotation: {
            id: string;
            start: number;
            end: number;
            text?: string;
            class?: string;
            tmpClass?: string;
            label?: string;
            target: import("..").AnnotationTarget;
            weight?: number;
            active?: boolean;
            visible?: boolean;
        };
        creating: boolean;
        userState: {
            state: import('../lib/annotatedTextUtils/StateClasses').UserActionState;
            payload: {
                startOffset: number;
                annotation?: {
                    id: string;
                    start: number;
                    end: number;
                    text?: string;
                    class?: string;
                    tmpClass?: string;
                    label?: string;
                    target: import("..").AnnotationTarget;
                    weight?: number;
                    active?: boolean;
                    visible?: boolean;
                };
                action?: string;
            };
            reset: () => void;
        };
        resetCreating: () => void;
        startCreating: (start: number) => void;
        initAnnotation: (annotation: import("..").Annotation) => void;
        updateCreating: () => void;
    }>;
    hoverState: import("vue").Ref<{
        hoveredAnnotations: {
            id: string;
            start: number;
            end: number;
            text?: string;
            class?: string;
            tmpClass?: string;
            label?: string;
            target: import("..").AnnotationTarget;
            weight?: number;
            active?: boolean;
            visible?: boolean;
        }[];
        mouseEvent: {
            readonly altKey: boolean;
            readonly button: number;
            readonly buttons: number;
            readonly clientX: number;
            readonly clientY: number;
            readonly ctrlKey: boolean;
            readonly metaKey: boolean;
            readonly movementX: number;
            readonly movementY: number;
            readonly offsetX: number;
            readonly offsetY: number;
            readonly pageX: number;
            readonly pageY: number;
            readonly relatedTarget: {
                addEventListener: (type: string, callback: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions) => void;
                dispatchEvent: (event: Event) => boolean;
                removeEventListener: (type: string, callback: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions) => void;
            };
            readonly screenX: number;
            readonly screenY: number;
            readonly shiftKey: boolean;
            readonly x: number;
            readonly y: number;
            getModifierState: (keyArg: string) => boolean;
            initMouseEvent: (typeArg: string, canBubbleArg: boolean, cancelableArg: boolean, viewArg: Window, detailArg: number, screenXArg: number, screenYArg: number, clientXArg: number, clientYArg: number, ctrlKeyArg: boolean, altKeyArg: boolean, shiftKeyArg: boolean, metaKeyArg: boolean, buttonArg: number, relatedTargetArg: EventTarget) => void;
            readonly detail: number;
            readonly view: Window;
            readonly which: number;
            initUIEvent: (typeArg: string, bubblesArg?: boolean, cancelableArg?: boolean, viewArg?: Window, detailArg?: number) => void;
            readonly bubbles: boolean;
            cancelBubble: boolean;
            readonly cancelable: boolean;
            readonly composed: boolean;
            readonly currentTarget: {
                addEventListener: (type: string, callback: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions) => void;
                dispatchEvent: (event: Event) => boolean;
                removeEventListener: (type: string, callback: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions) => void;
            };
            readonly defaultPrevented: boolean;
            readonly eventPhase: number;
            readonly isTrusted: boolean;
            returnValue: boolean;
            readonly srcElement: {
                addEventListener: (type: string, callback: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions) => void;
                dispatchEvent: (event: Event) => boolean;
                removeEventListener: (type: string, callback: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions) => void;
            };
            readonly target: {
                addEventListener: (type: string, callback: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions) => void;
                dispatchEvent: (event: Event) => boolean;
                removeEventListener: (type: string, callback: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions) => void;
            };
            readonly timeStamp: number;
            readonly type: string;
            composedPath: () => EventTarget[];
            initEvent: (type: string, bubbles?: boolean, cancelable?: boolean) => void;
            preventDefault: () => void;
            stopImmediatePropagation: () => void;
            stopPropagation: () => void;
            readonly NONE: 0;
            readonly CAPTURING_PHASE: 1;
            readonly AT_TARGET: 2;
            readonly BUBBLING_PHASE: 3;
        };
    }, HoverAnnotationsState | {
        hoveredAnnotations: {
            id: string;
            start: number;
            end: number;
            text?: string;
            class?: string;
            tmpClass?: string;
            label?: string;
            target: import("..").AnnotationTarget;
            weight?: number;
            active?: boolean;
            visible?: boolean;
        }[];
        mouseEvent: {
            readonly altKey: boolean;
            readonly button: number;
            readonly buttons: number;
            readonly clientX: number;
            readonly clientY: number;
            readonly ctrlKey: boolean;
            readonly metaKey: boolean;
            readonly movementX: number;
            readonly movementY: number;
            readonly offsetX: number;
            readonly offsetY: number;
            readonly pageX: number;
            readonly pageY: number;
            readonly relatedTarget: {
                addEventListener: (type: string, callback: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions) => void;
                dispatchEvent: (event: Event) => boolean;
                removeEventListener: (type: string, callback: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions) => void;
            };
            readonly screenX: number;
            readonly screenY: number;
            readonly shiftKey: boolean;
            readonly x: number;
            readonly y: number;
            getModifierState: (keyArg: string) => boolean;
            initMouseEvent: (typeArg: string, canBubbleArg: boolean, cancelableArg: boolean, viewArg: Window, detailArg: number, screenXArg: number, screenYArg: number, clientXArg: number, clientYArg: number, ctrlKeyArg: boolean, altKeyArg: boolean, shiftKeyArg: boolean, metaKeyArg: boolean, buttonArg: number, relatedTargetArg: EventTarget) => void;
            readonly detail: number;
            readonly view: Window;
            readonly which: number;
            initUIEvent: (typeArg: string, bubblesArg?: boolean, cancelableArg?: boolean, viewArg?: Window, detailArg?: number) => void;
            readonly bubbles: boolean;
            cancelBubble: boolean;
            readonly cancelable: boolean;
            readonly composed: boolean;
            readonly currentTarget: {
                addEventListener: (type: string, callback: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions) => void;
                dispatchEvent: (event: Event) => boolean;
                removeEventListener: (type: string, callback: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions) => void;
            };
            readonly defaultPrevented: boolean;
            readonly eventPhase: number;
            readonly isTrusted: boolean;
            returnValue: boolean;
            readonly srcElement: {
                addEventListener: (type: string, callback: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions) => void;
                dispatchEvent: (event: Event) => boolean;
                removeEventListener: (type: string, callback: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions) => void;
            };
            readonly target: {
                addEventListener: (type: string, callback: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions) => void;
                dispatchEvent: (event: Event) => boolean;
                removeEventListener: (type: string, callback: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions) => void;
            };
            readonly timeStamp: number;
            readonly type: string;
            composedPath: () => EventTarget[];
            initEvent: (type: string, bubbles?: boolean, cancelable?: boolean) => void;
            preventDefault: () => void;
            stopImmediatePropagation: () => void;
            stopPropagation: () => void;
            readonly NONE: 0;
            readonly CAPTURING_PHASE: 1;
            readonly AT_TARGET: 2;
            readonly BUBBLING_PHASE: 3;
        };
    }>;
    userState: import("vue").Ref<{
        state: import('../lib/annotatedTextUtils/StateClasses').UserActionState;
        payload: {
            startOffset: number;
            annotation?: {
                id: string;
                start: number;
                end: number;
                text?: string;
                class?: string;
                tmpClass?: string;
                label?: string;
                target: import("..").AnnotationTarget;
                weight?: number;
                active?: boolean;
                visible?: boolean;
            };
            action?: string;
        };
        reset: () => void;
    }, UserState | {
        state: import('../lib/annotatedTextUtils/StateClasses').UserActionState;
        payload: {
            startOffset: number;
            annotation?: {
                id: string;
                start: number;
                end: number;
                text?: string;
                class?: string;
                tmpClass?: string;
                label?: string;
                target: import("..").AnnotationTarget;
                weight?: number;
                active?: boolean;
                visible?: boolean;
            };
            action?: string;
        };
        reset: () => void;
    }>;
}, never>, Pick<{
    updateState: import("vue").Ref<{
        action: import("../types/AnnotatedText").ActionType;
        handlePosition: number;
        annotation: {
            id: string;
            start: number;
            end: number;
            text?: string;
            class?: string;
            tmpClass?: string;
            label?: string;
            target: import("..").AnnotationTarget;
            weight?: number;
            active?: boolean;
            visible?: boolean;
        };
        origAnnotation: {
            id: string;
            start: number;
            end: number;
            text?: string;
            class?: string;
            tmpClass?: string;
            label?: string;
            target: import("..").AnnotationTarget;
            weight?: number;
            active?: boolean;
            visible?: boolean;
        };
        origEnd?: number;
        origStart?: number;
        newEnd: number;
        newStart: number;
        updating: boolean;
        userState: {
            state: import('../lib/annotatedTextUtils/StateClasses').UserActionState;
            payload: {
                startOffset: number;
                annotation?: {
                    id: string;
                    start: number;
                    end: number;
                    text?: string;
                    class?: string;
                    tmpClass?: string;
                    label?: string;
                    target: import("..").AnnotationTarget;
                    weight?: number;
                    active?: boolean;
                    visible?: boolean;
                };
                action?: string;
            };
            reset: () => void;
        };
        resetUpdate: () => void;
        startUpdating: (action: import("../types/AnnotatedText").ActionType, handlePosition: number, annotation: import("..").Annotation, origEnd: number, origStart: number, newEnd: number, newStart: number) => void;
        confirmStartUpdating: () => void;
        confirmUpdate: () => void;
    }, UpdateAnnotationState | {
        action: import("../types/AnnotatedText").ActionType;
        handlePosition: number;
        annotation: {
            id: string;
            start: number;
            end: number;
            text?: string;
            class?: string;
            tmpClass?: string;
            label?: string;
            target: import("..").AnnotationTarget;
            weight?: number;
            active?: boolean;
            visible?: boolean;
        };
        origAnnotation: {
            id: string;
            start: number;
            end: number;
            text?: string;
            class?: string;
            tmpClass?: string;
            label?: string;
            target: import("..").AnnotationTarget;
            weight?: number;
            active?: boolean;
            visible?: boolean;
        };
        origEnd?: number;
        origStart?: number;
        newEnd: number;
        newStart: number;
        updating: boolean;
        userState: {
            state: import('../lib/annotatedTextUtils/StateClasses').UserActionState;
            payload: {
                startOffset: number;
                annotation?: {
                    id: string;
                    start: number;
                    end: number;
                    text?: string;
                    class?: string;
                    tmpClass?: string;
                    label?: string;
                    target: import("..").AnnotationTarget;
                    weight?: number;
                    active?: boolean;
                    visible?: boolean;
                };
                action?: string;
            };
            reset: () => void;
        };
        resetUpdate: () => void;
        startUpdating: (action: import("../types/AnnotatedText").ActionType, handlePosition: number, annotation: import("..").Annotation, origEnd: number, origStart: number, newEnd: number, newStart: number) => void;
        confirmStartUpdating: () => void;
        confirmUpdate: () => void;
    }>;
    createState: import("vue").Ref<{
        newEnd: number;
        newStart: number;
        annotation: {
            id: string;
            start: number;
            end: number;
            text?: string;
            class?: string;
            tmpClass?: string;
            label?: string;
            target: import("..").AnnotationTarget;
            weight?: number;
            active?: boolean;
            visible?: boolean;
        };
        creating: boolean;
        userState: {
            state: import('../lib/annotatedTextUtils/StateClasses').UserActionState;
            payload: {
                startOffset: number;
                annotation?: {
                    id: string;
                    start: number;
                    end: number;
                    text?: string;
                    class?: string;
                    tmpClass?: string;
                    label?: string;
                    target: import("..").AnnotationTarget;
                    weight?: number;
                    active?: boolean;
                    visible?: boolean;
                };
                action?: string;
            };
            reset: () => void;
        };
        resetCreating: () => void;
        startCreating: (start: number) => void;
        initAnnotation: (annotation: import("..").Annotation) => void;
        updateCreating: () => void;
    }, CreateAnnotationState | {
        newEnd: number;
        newStart: number;
        annotation: {
            id: string;
            start: number;
            end: number;
            text?: string;
            class?: string;
            tmpClass?: string;
            label?: string;
            target: import("..").AnnotationTarget;
            weight?: number;
            active?: boolean;
            visible?: boolean;
        };
        creating: boolean;
        userState: {
            state: import('../lib/annotatedTextUtils/StateClasses').UserActionState;
            payload: {
                startOffset: number;
                annotation?: {
                    id: string;
                    start: number;
                    end: number;
                    text?: string;
                    class?: string;
                    tmpClass?: string;
                    label?: string;
                    target: import("..").AnnotationTarget;
                    weight?: number;
                    active?: boolean;
                    visible?: boolean;
                };
                action?: string;
            };
            reset: () => void;
        };
        resetCreating: () => void;
        startCreating: (start: number) => void;
        initAnnotation: (annotation: import("..").Annotation) => void;
        updateCreating: () => void;
    }>;
    hoverState: import("vue").Ref<{
        hoveredAnnotations: {
            id: string;
            start: number;
            end: number;
            text?: string;
            class?: string;
            tmpClass?: string;
            label?: string;
            target: import("..").AnnotationTarget;
            weight?: number;
            active?: boolean;
            visible?: boolean;
        }[];
        mouseEvent: {
            readonly altKey: boolean;
            readonly button: number;
            readonly buttons: number;
            readonly clientX: number;
            readonly clientY: number;
            readonly ctrlKey: boolean;
            readonly metaKey: boolean;
            readonly movementX: number;
            readonly movementY: number;
            readonly offsetX: number;
            readonly offsetY: number;
            readonly pageX: number;
            readonly pageY: number;
            readonly relatedTarget: {
                addEventListener: (type: string, callback: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions) => void;
                dispatchEvent: (event: Event) => boolean;
                removeEventListener: (type: string, callback: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions) => void;
            };
            readonly screenX: number;
            readonly screenY: number;
            readonly shiftKey: boolean;
            readonly x: number;
            readonly y: number;
            getModifierState: (keyArg: string) => boolean;
            initMouseEvent: (typeArg: string, canBubbleArg: boolean, cancelableArg: boolean, viewArg: Window, detailArg: number, screenXArg: number, screenYArg: number, clientXArg: number, clientYArg: number, ctrlKeyArg: boolean, altKeyArg: boolean, shiftKeyArg: boolean, metaKeyArg: boolean, buttonArg: number, relatedTargetArg: EventTarget) => void;
            readonly detail: number;
            readonly view: Window;
            readonly which: number;
            initUIEvent: (typeArg: string, bubblesArg?: boolean, cancelableArg?: boolean, viewArg?: Window, detailArg?: number) => void;
            readonly bubbles: boolean;
            cancelBubble: boolean;
            readonly cancelable: boolean;
            readonly composed: boolean;
            readonly currentTarget: {
                addEventListener: (type: string, callback: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions) => void;
                dispatchEvent: (event: Event) => boolean;
                removeEventListener: (type: string, callback: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions) => void;
            };
            readonly defaultPrevented: boolean;
            readonly eventPhase: number;
            readonly isTrusted: boolean;
            returnValue: boolean;
            readonly srcElement: {
                addEventListener: (type: string, callback: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions) => void;
                dispatchEvent: (event: Event) => boolean;
                removeEventListener: (type: string, callback: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions) => void;
            };
            readonly target: {
                addEventListener: (type: string, callback: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions) => void;
                dispatchEvent: (event: Event) => boolean;
                removeEventListener: (type: string, callback: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions) => void;
            };
            readonly timeStamp: number;
            readonly type: string;
            composedPath: () => EventTarget[];
            initEvent: (type: string, bubbles?: boolean, cancelable?: boolean) => void;
            preventDefault: () => void;
            stopImmediatePropagation: () => void;
            stopPropagation: () => void;
            readonly NONE: 0;
            readonly CAPTURING_PHASE: 1;
            readonly AT_TARGET: 2;
            readonly BUBBLING_PHASE: 3;
        };
    }, HoverAnnotationsState | {
        hoveredAnnotations: {
            id: string;
            start: number;
            end: number;
            text?: string;
            class?: string;
            tmpClass?: string;
            label?: string;
            target: import("..").AnnotationTarget;
            weight?: number;
            active?: boolean;
            visible?: boolean;
        }[];
        mouseEvent: {
            readonly altKey: boolean;
            readonly button: number;
            readonly buttons: number;
            readonly clientX: number;
            readonly clientY: number;
            readonly ctrlKey: boolean;
            readonly metaKey: boolean;
            readonly movementX: number;
            readonly movementY: number;
            readonly offsetX: number;
            readonly offsetY: number;
            readonly pageX: number;
            readonly pageY: number;
            readonly relatedTarget: {
                addEventListener: (type: string, callback: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions) => void;
                dispatchEvent: (event: Event) => boolean;
                removeEventListener: (type: string, callback: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions) => void;
            };
            readonly screenX: number;
            readonly screenY: number;
            readonly shiftKey: boolean;
            readonly x: number;
            readonly y: number;
            getModifierState: (keyArg: string) => boolean;
            initMouseEvent: (typeArg: string, canBubbleArg: boolean, cancelableArg: boolean, viewArg: Window, detailArg: number, screenXArg: number, screenYArg: number, clientXArg: number, clientYArg: number, ctrlKeyArg: boolean, altKeyArg: boolean, shiftKeyArg: boolean, metaKeyArg: boolean, buttonArg: number, relatedTargetArg: EventTarget) => void;
            readonly detail: number;
            readonly view: Window;
            readonly which: number;
            initUIEvent: (typeArg: string, bubblesArg?: boolean, cancelableArg?: boolean, viewArg?: Window, detailArg?: number) => void;
            readonly bubbles: boolean;
            cancelBubble: boolean;
            readonly cancelable: boolean;
            readonly composed: boolean;
            readonly currentTarget: {
                addEventListener: (type: string, callback: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions) => void;
                dispatchEvent: (event: Event) => boolean;
                removeEventListener: (type: string, callback: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions) => void;
            };
            readonly defaultPrevented: boolean;
            readonly eventPhase: number;
            readonly isTrusted: boolean;
            returnValue: boolean;
            readonly srcElement: {
                addEventListener: (type: string, callback: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions) => void;
                dispatchEvent: (event: Event) => boolean;
                removeEventListener: (type: string, callback: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions) => void;
            };
            readonly target: {
                addEventListener: (type: string, callback: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions) => void;
                dispatchEvent: (event: Event) => boolean;
                removeEventListener: (type: string, callback: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions) => void;
            };
            readonly timeStamp: number;
            readonly type: string;
            composedPath: () => EventTarget[];
            initEvent: (type: string, bubbles?: boolean, cancelable?: boolean) => void;
            preventDefault: () => void;
            stopImmediatePropagation: () => void;
            stopPropagation: () => void;
            readonly NONE: 0;
            readonly CAPTURING_PHASE: 1;
            readonly AT_TARGET: 2;
            readonly BUBBLING_PHASE: 3;
        };
    }>;
    userState: import("vue").Ref<{
        state: import('../lib/annotatedTextUtils/StateClasses').UserActionState;
        payload: {
            startOffset: number;
            annotation?: {
                id: string;
                start: number;
                end: number;
                text?: string;
                class?: string;
                tmpClass?: string;
                label?: string;
                target: import("..").AnnotationTarget;
                weight?: number;
                active?: boolean;
                visible?: boolean;
            };
            action?: string;
        };
        reset: () => void;
    }, UserState | {
        state: import('../lib/annotatedTextUtils/StateClasses').UserActionState;
        payload: {
            startOffset: number;
            annotation?: {
                id: string;
                start: number;
                end: number;
                text?: string;
                class?: string;
                tmpClass?: string;
                label?: string;
                target: import("..").AnnotationTarget;
                weight?: number;
                active?: boolean;
                visible?: boolean;
            };
            action?: string;
        };
        reset: () => void;
    }>;
}, never>>;
