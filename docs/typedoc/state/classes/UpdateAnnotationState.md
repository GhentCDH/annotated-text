[**@ghentcdh/vue-component-annotated-text**](../../README.md) • **Docs**

***

[@ghentcdh/vue-component-annotated-text](../../modules.md) / [state](../README.md) / UpdateAnnotationState

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

[src/state/states/UpdateAnnotationState.ts:23](https://github.com/GhentCDH/vue_component_annotated_text/blob/d51ee50afdd4ab5cda55f7357c95be62d9ee9e3f/src/state/states/UpdateAnnotationState.ts#L23)

## Properties

### action

> **action**: [`ActionType`](../../types/AnnotatedText/type-aliases/ActionType.md)

#### Defined in

[src/state/states/UpdateAnnotationState.ts:12](https://github.com/GhentCDH/vue_component_annotated_text/blob/d51ee50afdd4ab5cda55f7357c95be62d9ee9e3f/src/state/states/UpdateAnnotationState.ts#L12)

***

### annotation

> **annotation**: [`Annotation`](../../types/Annotation/interfaces/Annotation.md)

#### Defined in

[src/state/states/UpdateAnnotationState.ts:14](https://github.com/GhentCDH/vue_component_annotated_text/blob/d51ee50afdd4ab5cda55f7357c95be62d9ee9e3f/src/state/states/UpdateAnnotationState.ts#L14)

***

### handlePosition

> **handlePosition**: `number`

#### Defined in

[src/state/states/UpdateAnnotationState.ts:13](https://github.com/GhentCDH/vue_component_annotated_text/blob/d51ee50afdd4ab5cda55f7357c95be62d9ee9e3f/src/state/states/UpdateAnnotationState.ts#L13)

***

### newEnd

> **newEnd**: `number`

#### Defined in

[src/state/states/UpdateAnnotationState.ts:18](https://github.com/GhentCDH/vue_component_annotated_text/blob/d51ee50afdd4ab5cda55f7357c95be62d9ee9e3f/src/state/states/UpdateAnnotationState.ts#L18)

***

### newStart

> **newStart**: `number`

#### Defined in

[src/state/states/UpdateAnnotationState.ts:19](https://github.com/GhentCDH/vue_component_annotated_text/blob/d51ee50afdd4ab5cda55f7357c95be62d9ee9e3f/src/state/states/UpdateAnnotationState.ts#L19)

***

### origAnnotation

> **origAnnotation**: [`Annotation`](../../types/Annotation/interfaces/Annotation.md)

#### Defined in

[src/state/states/UpdateAnnotationState.ts:15](https://github.com/GhentCDH/vue_component_annotated_text/blob/d51ee50afdd4ab5cda55f7357c95be62d9ee9e3f/src/state/states/UpdateAnnotationState.ts#L15)

***

### origEnd?

> `optional` **origEnd**: `number`

#### Defined in

[src/state/states/UpdateAnnotationState.ts:16](https://github.com/GhentCDH/vue_component_annotated_text/blob/d51ee50afdd4ab5cda55f7357c95be62d9ee9e3f/src/state/states/UpdateAnnotationState.ts#L16)

***

### origStart?

> `optional` **origStart**: `number`

#### Defined in

[src/state/states/UpdateAnnotationState.ts:17](https://github.com/GhentCDH/vue_component_annotated_text/blob/d51ee50afdd4ab5cda55f7357c95be62d9ee9e3f/src/state/states/UpdateAnnotationState.ts#L17)

***

### updating

> **updating**: `boolean` = `false`

#### Defined in

[src/state/states/UpdateAnnotationState.ts:20](https://github.com/GhentCDH/vue_component_annotated_text/blob/d51ee50afdd4ab5cda55f7357c95be62d9ee9e3f/src/state/states/UpdateAnnotationState.ts#L20)

***

### userState

> **userState**: [`UserState`](UserState.md)

#### Defined in

[src/state/states/UpdateAnnotationState.ts:21](https://github.com/GhentCDH/vue_component_annotated_text/blob/d51ee50afdd4ab5cda55f7357c95be62d9ee9e3f/src/state/states/UpdateAnnotationState.ts#L21)

## Methods

### confirmStartUpdating()

> **confirmStartUpdating**(): `void`

Should get called in order to confirm the initial state of the update.

#### Returns

`void`

#### Defined in

[src/state/states/UpdateAnnotationState.ts:78](https://github.com/GhentCDH/vue_component_annotated_text/blob/d51ee50afdd4ab5cda55f7357c95be62d9ee9e3f/src/state/states/UpdateAnnotationState.ts#L78)

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

[src/state/states/UpdateAnnotationState.ts:90](https://github.com/GhentCDH/vue_component_annotated_text/blob/d51ee50afdd4ab5cda55f7357c95be62d9ee9e3f/src/state/states/UpdateAnnotationState.ts#L90)

***

### resetUpdate()

> **resetUpdate**(): `void`

has to get called after an edit has been confirmed or denied.

#### Returns

`void`

#### Defined in

[src/state/states/UpdateAnnotationState.ts:31](https://github.com/GhentCDH/vue_component_annotated_text/blob/d51ee50afdd4ab5cda55f7357c95be62d9ee9e3f/src/state/states/UpdateAnnotationState.ts#L31)

***

### startUpdating()

> **startUpdating**(`action`, `handlePosition`, `annotation`, `origEnd`, `origStart`, `newEnd`, `newStart`): `void`

Gets called by the component when an edit it started. Should generally not
be called by the parent component.

#### Parameters

• **action**: [`ActionType`](../../types/AnnotatedText/type-aliases/ActionType.md)

• **handlePosition**: `number`

• **annotation**: [`Annotation`](../../types/Annotation/interfaces/Annotation.md)

• **origEnd**: `number` = `null`

• **origStart**: `number` = `null`

• **newEnd**: `number`

• **newStart**: `number`

#### Returns

`void`

#### Defined in

[src/state/states/UpdateAnnotationState.ts:56](https://github.com/GhentCDH/vue_component_annotated_text/blob/d51ee50afdd4ab5cda55f7357c95be62d9ee9e3f/src/state/states/UpdateAnnotationState.ts#L56)
