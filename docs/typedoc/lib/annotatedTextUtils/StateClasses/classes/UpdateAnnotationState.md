[**@ghentcdh/vue-component-annotated-text**](../../../../README.md) • **Docs**

***

[@ghentcdh/vue-component-annotated-text](../../../../modules.md) / [lib/annotatedTextUtils/StateClasses](../README.md) / UpdateAnnotationState

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

[lib/annotatedTextUtils/StateClasses.ts:49](https://github.com/GhentCDH/vue_component_annotated_text/blob/5675fc54077a4297a03f45161e62f99e3d8b3eba/src/lib/annotatedTextUtils/StateClasses.ts#L49)

## Properties

### action

> **action**: [`ActionType`](../../../../types/AnnotatedText/type-aliases/ActionType.md)

#### Defined in

[lib/annotatedTextUtils/StateClasses.ts:38](https://github.com/GhentCDH/vue_component_annotated_text/blob/5675fc54077a4297a03f45161e62f99e3d8b3eba/src/lib/annotatedTextUtils/StateClasses.ts#L38)

***

### annotation

> **annotation**: [`Annotation`](../../../../types/Annotation/interfaces/Annotation.md)

#### Defined in

[lib/annotatedTextUtils/StateClasses.ts:40](https://github.com/GhentCDH/vue_component_annotated_text/blob/5675fc54077a4297a03f45161e62f99e3d8b3eba/src/lib/annotatedTextUtils/StateClasses.ts#L40)

***

### handlePosition

> **handlePosition**: `number`

#### Defined in

[lib/annotatedTextUtils/StateClasses.ts:39](https://github.com/GhentCDH/vue_component_annotated_text/blob/5675fc54077a4297a03f45161e62f99e3d8b3eba/src/lib/annotatedTextUtils/StateClasses.ts#L39)

***

### newEnd

> **newEnd**: `number`

#### Defined in

[lib/annotatedTextUtils/StateClasses.ts:44](https://github.com/GhentCDH/vue_component_annotated_text/blob/5675fc54077a4297a03f45161e62f99e3d8b3eba/src/lib/annotatedTextUtils/StateClasses.ts#L44)

***

### newStart

> **newStart**: `number`

#### Defined in

[lib/annotatedTextUtils/StateClasses.ts:45](https://github.com/GhentCDH/vue_component_annotated_text/blob/5675fc54077a4297a03f45161e62f99e3d8b3eba/src/lib/annotatedTextUtils/StateClasses.ts#L45)

***

### origAnnotation

> **origAnnotation**: [`Annotation`](../../../../types/Annotation/interfaces/Annotation.md)

#### Defined in

[lib/annotatedTextUtils/StateClasses.ts:41](https://github.com/GhentCDH/vue_component_annotated_text/blob/5675fc54077a4297a03f45161e62f99e3d8b3eba/src/lib/annotatedTextUtils/StateClasses.ts#L41)

***

### origEnd?

> `optional` **origEnd**: `number`

#### Defined in

[lib/annotatedTextUtils/StateClasses.ts:42](https://github.com/GhentCDH/vue_component_annotated_text/blob/5675fc54077a4297a03f45161e62f99e3d8b3eba/src/lib/annotatedTextUtils/StateClasses.ts#L42)

***

### origStart?

> `optional` **origStart**: `number`

#### Defined in

[lib/annotatedTextUtils/StateClasses.ts:43](https://github.com/GhentCDH/vue_component_annotated_text/blob/5675fc54077a4297a03f45161e62f99e3d8b3eba/src/lib/annotatedTextUtils/StateClasses.ts#L43)

***

### updating

> **updating**: `boolean` = `false`

#### Defined in

[lib/annotatedTextUtils/StateClasses.ts:46](https://github.com/GhentCDH/vue_component_annotated_text/blob/5675fc54077a4297a03f45161e62f99e3d8b3eba/src/lib/annotatedTextUtils/StateClasses.ts#L46)

***

### userState

> **userState**: [`UserState`](UserState.md)

#### Defined in

[lib/annotatedTextUtils/StateClasses.ts:47](https://github.com/GhentCDH/vue_component_annotated_text/blob/5675fc54077a4297a03f45161e62f99e3d8b3eba/src/lib/annotatedTextUtils/StateClasses.ts#L47)

## Methods

### confirmStartUpdating()

> **confirmStartUpdating**(): `void`

Should get called in order to confirm the initial state of the update.

#### Returns

`void`

#### Defined in

[lib/annotatedTextUtils/StateClasses.ts:104](https://github.com/GhentCDH/vue_component_annotated_text/blob/5675fc54077a4297a03f45161e62f99e3d8b3eba/src/lib/annotatedTextUtils/StateClasses.ts#L104)

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

[lib/annotatedTextUtils/StateClasses.ts:116](https://github.com/GhentCDH/vue_component_annotated_text/blob/5675fc54077a4297a03f45161e62f99e3d8b3eba/src/lib/annotatedTextUtils/StateClasses.ts#L116)

***

### resetUpdate()

> **resetUpdate**(): `void`

has to get called after an edit has been confirmed or denied.

#### Returns

`void`

#### Defined in

[lib/annotatedTextUtils/StateClasses.ts:57](https://github.com/GhentCDH/vue_component_annotated_text/blob/5675fc54077a4297a03f45161e62f99e3d8b3eba/src/lib/annotatedTextUtils/StateClasses.ts#L57)

***

### startUpdating()

> **startUpdating**(`action`, `handlePosition`, `annotation`, `origEnd`, `origStart`, `newEnd`, `newStart`): `void`

Gets called by the component when an edit it started. Should generally not
be called by the parent component.

#### Parameters

• **action**: [`ActionType`](../../../../types/AnnotatedText/type-aliases/ActionType.md)

• **handlePosition**: `number`

• **annotation**: [`Annotation`](../../../../types/Annotation/interfaces/Annotation.md)

• **origEnd**: `number` = `null`

• **origStart**: `number` = `null`

• **newEnd**: `number`

• **newStart**: `number`

#### Returns

`void`

#### Defined in

[lib/annotatedTextUtils/StateClasses.ts:82](https://github.com/GhentCDH/vue_component_annotated_text/blob/5675fc54077a4297a03f45161e62f99e3d8b3eba/src/lib/annotatedTextUtils/StateClasses.ts#L82)
