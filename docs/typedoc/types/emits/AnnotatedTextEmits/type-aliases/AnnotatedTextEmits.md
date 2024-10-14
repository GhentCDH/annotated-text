[**@ghentcdh/vue-component-annotated-text**](../../../../README.md) • **Docs**

***

[@ghentcdh/vue-component-annotated-text](../../../../modules.md) / [types/emits/AnnotatedTextEmits](../README.md) / AnnotatedTextEmits

# Type Alias: AnnotatedTextEmits

> **AnnotatedTextEmits**: `object`

## Type declaration

### annotation-create-begin

> **annotation-create-begin**: [[`CreateAnnotationState`](../../../../state/classes/CreateAnnotationState.md)]

Emitted when the mouse is pressed down on plain text.

If listening to this emit, createState.initAnnotation should be called to initialize the new annotation being created.

#### Arg

createState object holding the state of the being created annotation

### annotation-create-end

> **annotation-create-end**: [[`CreateAnnotationState`](../../../../state/classes/CreateAnnotationState.md)]

Emitted when during creation the mouse is released.

#### Arg

createState object holding the state of the being created annotation. The annotation field holds the newly created annotation.

### annotation-creating

> **annotation-creating**: [[`CreateAnnotationState`](../../../../state/classes/CreateAnnotationState.md)]

Emitted on every mouse move while creating an annotation.

The newEnd and newStart fields of the createState object can be edited.

createState.updateCreating needs to be called to confirm the new position after the mouse move.

#### Arg

createState object holding the state of the being created annotation

### annotation-mouse-leave

> **annotation-mouse-leave**: [[`Annotation`](../../../Annotation/interfaces/Annotation.md)[], `MouseEvent`]

Emitted when the mouse stops hovering over annotations

#### Arg

hoveredAnnotations List of now newly no longer hovered annotations

#### Arg

mouseEvent Normal dom mouse event

### annotation-mouse-over

> **annotation-mouse-over**: [[`Annotation`](../../../Annotation/interfaces/Annotation.md)[], `MouseEvent`]

Emitted when the mouse goes over new annotations

#### Arg

hoveredAnnotations List newly hovered annotations

#### Arg

mouseEvent Normal dom mouse event

### annotation-select

> **annotation-select**: [[`Annotation`](../../../Annotation/interfaces/Annotation.md), `MouseEvent`]

Emitted when an annotation (both span and gutter) is clicked.

#### Arg

annotation Annotation object that was clicked

#### Arg

mouseEvent normal dom mouse event

### annotation-update-begin

> **annotation-update-begin**: [[`UpdateAnnotationState`](../../../../state/classes/UpdateAnnotationState.md)]

Emitted when the user starts updating an annotation, so when the mouse is
clicked down and the listenToOnUpdateStart prop is true.

The newStart and newEnd fields of the updateState can be edited.

updateState.confirmStartUpdating should be called in order to confirm
the start of the update

#### Arg

updateState object holding the state of the update

### annotation-update-end

> **annotation-update-end**: [[`UpdateAnnotationState`](../../../../state/classes/UpdateAnnotationState.md)]

Emitted when during an update the mouse is released.

#### Arg

updateState updateState object containing the new annotation object in the annotation field.

### annotation-updating

> **annotation-updating**: [[`UpdateAnnotationState`](../../../../state/classes/UpdateAnnotationState.md)]

Emitted every time the user moves their cursor while updating an
annotation. Only emitted if the listenToOnUpdating prop is true.

The newStart and newEnd fields of the updateState can be edited.

updateState.confirmUpdate should be called in order to confirm the new
position after the mouse move.

#### Arg

updateState object holding the state of the update

### key-pressed

> **key-pressed**: [`KeyboardEvent`, [`UpdateAnnotationState`](../../../../state/classes/UpdateAnnotationState.md), [`CreateAnnotationState`](../../../../state/classes/CreateAnnotationState.md), [`UserState`](../../../../state/classes/UserState.md)]

Emitted whenever any key is pressed. Can be used to reset updating or creating states

#### Arg

keyEvent key event object

#### Arg

updateState {UpdateAnnotationState}

#### Arg

createState {CreateAnnotationState}

#### Arg

userState {UserState}

### user-action-state-change

> **user-action-state-change**: [[`UserActionState`](../../../../state/enumerations/UserActionState.md), [`UserActionState`](../../../../state/enumerations/UserActionState.md)]

Emitted whenever the internal user state changes

#### Arg

oldState Old user action state

#### Arg

newState New user action state

## Defined in

[src/types/emits/AnnotatedTextEmits.ts:9](https://github.com/GhentCDH/vue_component_annotated_text/blob/bbd5dc841c855a8533eb4b63ec1d23dd4ebf9e1d/src/types/emits/AnnotatedTextEmits.ts#L9)
