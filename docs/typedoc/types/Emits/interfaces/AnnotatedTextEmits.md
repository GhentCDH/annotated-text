[**@ghentcdh/vue-component-annotated-text**](../../../README.md) • **Docs**

***

[@ghentcdh/vue-component-annotated-text](../../../modules.md) / [types/Emits](../README.md) / AnnotatedTextEmits

# Interface: AnnotatedTextEmits

## Properties

### annotation-create-begin

> **annotation-create-begin**: [[`CreateAnnotationState`](../../../lib/annotatedTextUtils/StateClasses/classes/CreateAnnotationState.md)]

Emitted when the mouse is pressed down on plain text.

If listening to this emit, createState.initAnnotation should be called to initialize the new annotation being created.

#### Arg

createState object holding the state of the being created annotation

#### Defined in

[types/Emits.ts:52](https://github.com/GhentCDH/vue_component_annotated_text/blob/d7f662fc6e4815223b2966a3f98cd4c1fa9a5954/src/types/Emits.ts#L52)

***

### annotation-create-end

> **annotation-create-end**: [[`CreateAnnotationState`](../../../lib/annotatedTextUtils/StateClasses/classes/CreateAnnotationState.md)]

Emitted when during creation the mouse is released.

#### Arg

createState object holding the state of the being created annotation. The annotation field holds the newly created annotation.

#### Defined in

[types/Emits.ts:68](https://github.com/GhentCDH/vue_component_annotated_text/blob/d7f662fc6e4815223b2966a3f98cd4c1fa9a5954/src/types/Emits.ts#L68)

***

### annotation-creating

> **annotation-creating**: [[`CreateAnnotationState`](../../../lib/annotatedTextUtils/StateClasses/classes/CreateAnnotationState.md)]

Emitted on every mouse move while creating an annotation.

The newEnd and newStart fields of the createState object can be edited.

createState.updateCreating needs to be called to confirm the new position after the mouse move.

#### Arg

createState object holding the state of the being created annotation

#### Defined in

[types/Emits.ts:62](https://github.com/GhentCDH/vue_component_annotated_text/blob/d7f662fc6e4815223b2966a3f98cd4c1fa9a5954/src/types/Emits.ts#L62)

***

### annotation-mouse-leave

> **annotation-mouse-leave**: [[`Annotation`](../../Annotation/interfaces/Annotation.md)[], `MouseEvent`]

Emitted when the mouse stops hovering over annotations

#### Arg

hoveredAnnotations List of now newly no longer hovered annotations

#### Arg

mouseEvent Normal dom mouse event

#### Defined in

[types/Emits.ts:97](https://github.com/GhentCDH/vue_component_annotated_text/blob/d7f662fc6e4815223b2966a3f98cd4c1fa9a5954/src/types/Emits.ts#L97)

***

### annotation-mouse-over

> **annotation-mouse-over**: [[`Annotation`](../../Annotation/interfaces/Annotation.md)[], `MouseEvent`]

Emitted when the mouse goes over new annotations

#### Arg

hoveredAnnotations List newly hovered annotations

#### Arg

mouseEvent Normal dom mouse event

#### Defined in

[types/Emits.ts:88](https://github.com/GhentCDH/vue_component_annotated_text/blob/d7f662fc6e4815223b2966a3f98cd4c1fa9a5954/src/types/Emits.ts#L88)

***

### annotation-select

> **annotation-select**: [[`Annotation`](../../Annotation/interfaces/Annotation.md), `MouseEvent`]

Emitted when an annotation (both span and gutter) is clicked.

#### Arg

annotation Annotation object that was clicked

#### Arg

mouseEvent normal dom mouse event

#### Defined in

[types/Emits.ts:15](https://github.com/GhentCDH/vue_component_annotated_text/blob/d7f662fc6e4815223b2966a3f98cd4c1fa9a5954/src/types/Emits.ts#L15)

***

### annotation-update-begin

> **annotation-update-begin**: [[`UpdateAnnotationState`](../../../lib/annotatedTextUtils/StateClasses/classes/UpdateAnnotationState.md)]

Emitted when the user starts updating an annotation, so when the mouse is
clicked down and the listenToOnUpdateStart prop is true.

The newStart and newEnd fields of the updateState can be edited.

updateState.confirmStartUpdating should be called in order to confirm
the start of the update

#### Arg

updateState object holding the state of the update

#### Defined in

[types/Emits.ts:26](https://github.com/GhentCDH/vue_component_annotated_text/blob/d7f662fc6e4815223b2966a3f98cd4c1fa9a5954/src/types/Emits.ts#L26)

***

### annotation-update-end

> **annotation-update-end**: [[`UpdateAnnotationState`](../../../lib/annotatedTextUtils/StateClasses/classes/UpdateAnnotationState.md)]

Emitted when during an update the mouse is released.

#### Arg

updateState updateState object containing the new annotation object in the annotation field.

#### Defined in

[types/Emits.ts:44](https://github.com/GhentCDH/vue_component_annotated_text/blob/d7f662fc6e4815223b2966a3f98cd4c1fa9a5954/src/types/Emits.ts#L44)

***

### annotation-updating

> **annotation-updating**: [[`UpdateAnnotationState`](../../../lib/annotatedTextUtils/StateClasses/classes/UpdateAnnotationState.md)]

Emitted every time the user moves their cursor while updating an
annotation. Only emitted if the listenToOnUpdating prop is true.

The newStart and newEnd fields of the updateState can be edited.

updateState.confirmUpdate should be called in order to confirm the new
position after the mouse move.

#### Arg

updateState object holding the state of the update

#### Defined in

[types/Emits.ts:37](https://github.com/GhentCDH/vue_component_annotated_text/blob/d7f662fc6e4815223b2966a3f98cd4c1fa9a5954/src/types/Emits.ts#L37)

***

### key-pressed

> **key-pressed**: [`KeyboardEvent`, [`UpdateAnnotationState`](../../../lib/annotatedTextUtils/StateClasses/classes/UpdateAnnotationState.md), [`CreateAnnotationState`](../../../lib/annotatedTextUtils/StateClasses/classes/CreateAnnotationState.md), [`UserState`](../../../lib/annotatedTextUtils/StateClasses/classes/UserState.md)]

Emitted whenever any key is pressed. Can be used to reset updating or creating states

#### Arg

keyEvent key event object

#### Arg

updateState {UpdateAnnotationState}

#### Arg

createState {CreateAnnotationState}

#### Arg

userState {UserState}

#### Defined in

[types/Emits.ts:77](https://github.com/GhentCDH/vue_component_annotated_text/blob/d7f662fc6e4815223b2966a3f98cd4c1fa9a5954/src/types/Emits.ts#L77)

***

### user-action-state-change

> **user-action-state-change**: [[`UserActionState`](../../../lib/annotatedTextUtils/StateClasses/enumerations/UserActionState.md), [`UserActionState`](../../../lib/annotatedTextUtils/StateClasses/enumerations/UserActionState.md)]

Emitted whenever the internal user state changes

#### Arg

oldState Old user action state

#### Arg

newState New user action state

#### Defined in

[types/Emits.ts:106](https://github.com/GhentCDH/vue_component_annotated_text/blob/d7f662fc6e4815223b2966a3f98cd4c1fa9a5954/src/types/Emits.ts#L106)
