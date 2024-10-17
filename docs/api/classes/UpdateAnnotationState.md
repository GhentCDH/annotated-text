[@ghentcdh/vue-component-annotated-text](../globals.md) / UpdateAnnotationState

# Class: UpdateAnnotationState

Hold a state of an annotation currently being edited, not yet confirmed by
the parent component

## Annotation

deep copy of the being edited annotation

## Constructors

### new UpdateAnnotationState()

> **new UpdateAnnotationState**(`userState`): [`UpdateAnnotationState`](UpdateAnnotationState.md)

#### Parameters

• **userState**: [`UserState`](UserState.md)

#### Returns

[`UpdateAnnotationState`](UpdateAnnotationState.md)

#### Defined in

[state/states/UpdateAnnotationState.ts:24](https://github.com/GhentCDH/vue_component_annotated_text/blob/1a1305298088f2a8b844c3bc4c9169f47cb7de8b/src/state/states/UpdateAnnotationState.ts#L24)

## Properties

### action

> **action**: `ActionType`

#### Defined in

[state/states/UpdateAnnotationState.ts:13](https://github.com/GhentCDH/vue_component_annotated_text/blob/1a1305298088f2a8b844c3bc4c9169f47cb7de8b/src/state/states/UpdateAnnotationState.ts#L13)

***

### annotation

> **annotation**: [`Annotation`](../interfaces/Annotation.md)

#### Defined in

[state/states/UpdateAnnotationState.ts:15](https://github.com/GhentCDH/vue_component_annotated_text/blob/1a1305298088f2a8b844c3bc4c9169f47cb7de8b/src/state/states/UpdateAnnotationState.ts#L15)

***

### handlePosition

> **handlePosition**: `number`

#### Defined in

[state/states/UpdateAnnotationState.ts:14](https://github.com/GhentCDH/vue_component_annotated_text/blob/1a1305298088f2a8b844c3bc4c9169f47cb7de8b/src/state/states/UpdateAnnotationState.ts#L14)

***

### newEnd

> **newEnd**: `number`

#### Defined in

[state/states/UpdateAnnotationState.ts:19](https://github.com/GhentCDH/vue_component_annotated_text/blob/1a1305298088f2a8b844c3bc4c9169f47cb7de8b/src/state/states/UpdateAnnotationState.ts#L19)

***

### newStart

> **newStart**: `number`

#### Defined in

[state/states/UpdateAnnotationState.ts:20](https://github.com/GhentCDH/vue_component_annotated_text/blob/1a1305298088f2a8b844c3bc4c9169f47cb7de8b/src/state/states/UpdateAnnotationState.ts#L20)

***

### origAnnotation

> **origAnnotation**: [`Annotation`](../interfaces/Annotation.md)

#### Defined in

[state/states/UpdateAnnotationState.ts:16](https://github.com/GhentCDH/vue_component_annotated_text/blob/1a1305298088f2a8b844c3bc4c9169f47cb7de8b/src/state/states/UpdateAnnotationState.ts#L16)

***

### origEnd?

> `optional` **origEnd**: `number`

#### Defined in

[state/states/UpdateAnnotationState.ts:17](https://github.com/GhentCDH/vue_component_annotated_text/blob/1a1305298088f2a8b844c3bc4c9169f47cb7de8b/src/state/states/UpdateAnnotationState.ts#L17)

***

### origStart?

> `optional` **origStart**: `number`

#### Defined in

[state/states/UpdateAnnotationState.ts:18](https://github.com/GhentCDH/vue_component_annotated_text/blob/1a1305298088f2a8b844c3bc4c9169f47cb7de8b/src/state/states/UpdateAnnotationState.ts#L18)

***

### updating

> **updating**: `boolean` = `false`

#### Defined in

[state/states/UpdateAnnotationState.ts:21](https://github.com/GhentCDH/vue_component_annotated_text/blob/1a1305298088f2a8b844c3bc4c9169f47cb7de8b/src/state/states/UpdateAnnotationState.ts#L21)

***

### userState

> **userState**: [`UserState`](UserState.md)

#### Defined in

[state/states/UpdateAnnotationState.ts:22](https://github.com/GhentCDH/vue_component_annotated_text/blob/1a1305298088f2a8b844c3bc4c9169f47cb7de8b/src/state/states/UpdateAnnotationState.ts#L22)

## Methods

### confirmStartUpdating()

> **confirmStartUpdating**(): `void`

Should get called in order to confirm the initial state of the update.

#### Returns

`void`

#### Defined in

[state/states/UpdateAnnotationState.ts:79](https://github.com/GhentCDH/vue_component_annotated_text/blob/1a1305298088f2a8b844c3bc4c9169f47cb7de8b/src/state/states/UpdateAnnotationState.ts#L79)

***

### confirmUpdate()

> **confirmUpdate**(): `void`

Needs to be called by the parent component every time annotation-edit-moved
is emitted in order to confirm that edit. newStart and newEnd can be
edited before calling this in order to manipulate on what annotations have
to wrap.

#### Returns

`void`

#### Defined in

[state/states/UpdateAnnotationState.ts:91](https://github.com/GhentCDH/vue_component_annotated_text/blob/1a1305298088f2a8b844c3bc4c9169f47cb7de8b/src/state/states/UpdateAnnotationState.ts#L91)

***

### resetUpdate()

> **resetUpdate**(): `void`

has to get called after an edit has been confirmed or denied.

#### Returns

`void`

#### Defined in

[state/states/UpdateAnnotationState.ts:32](https://github.com/GhentCDH/vue_component_annotated_text/blob/1a1305298088f2a8b844c3bc4c9169f47cb7de8b/src/state/states/UpdateAnnotationState.ts#L32)

***

### startUpdating()

> **startUpdating**(`action`, `handlePosition`, `annotation`, `origEnd`, `origStart`, `newEnd`, `newStart`): `void`

Gets called by the component when an edit it started. Should generally not
be called by the parent component.

#### Parameters

• **action**: `ActionType`

• **handlePosition**: `number`

• **annotation**: [`Annotation`](../interfaces/Annotation.md)

• **origEnd**: `number` = `null`

• **origStart**: `number` = `null`

• **newEnd**: `number`

• **newStart**: `number`

#### Returns

`void`

#### Defined in

[state/states/UpdateAnnotationState.ts:57](https://github.com/GhentCDH/vue_component_annotated_text/blob/1a1305298088f2a8b844c3bc4c9169f47cb7de8b/src/state/states/UpdateAnnotationState.ts#L57)
