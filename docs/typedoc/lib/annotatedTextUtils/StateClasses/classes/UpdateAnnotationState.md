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

lib/annotatedTextUtils/StateClasses.ts:38

## Properties

### action

> **action**: [`ActionType`](../../../../types/AnnotatedText/type-aliases/ActionType.md)

#### Defined in

lib/annotatedTextUtils/StateClasses.ts:27

***

### annotation

> **annotation**: [`Annotation`](../../../../types/Annotation/interfaces/Annotation.md)

#### Defined in

lib/annotatedTextUtils/StateClasses.ts:29

***

### handlePosition

> **handlePosition**: `number`

#### Defined in

lib/annotatedTextUtils/StateClasses.ts:28

***

### newEnd

> **newEnd**: `number`

#### Defined in

lib/annotatedTextUtils/StateClasses.ts:33

***

### newStart

> **newStart**: `number`

#### Defined in

lib/annotatedTextUtils/StateClasses.ts:34

***

### origAnnotation

> **origAnnotation**: [`Annotation`](../../../../types/Annotation/interfaces/Annotation.md)

#### Defined in

lib/annotatedTextUtils/StateClasses.ts:30

***

### origEnd?

> `optional` **origEnd**: `number`

#### Defined in

lib/annotatedTextUtils/StateClasses.ts:31

***

### origStart?

> `optional` **origStart**: `number`

#### Defined in

lib/annotatedTextUtils/StateClasses.ts:32

***

### updating

> **updating**: `boolean` = `false`

#### Defined in

lib/annotatedTextUtils/StateClasses.ts:35

***

### userState

> **userState**: [`UserState`](UserState.md)

#### Defined in

lib/annotatedTextUtils/StateClasses.ts:36

## Methods

### confirmStartUpdating()

> **confirmStartUpdating**(): `void`

Should get called in order to confirm the initial state of the update.

#### Returns

`void`

#### Defined in

lib/annotatedTextUtils/StateClasses.ts:94

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

lib/annotatedTextUtils/StateClasses.ts:105

***

### resetUpdate()

> **resetUpdate**(): `void`

has to get called after an edit has been confirmed or denied.

#### Returns

`void`

#### Defined in

lib/annotatedTextUtils/StateClasses.ts:46

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

lib/annotatedTextUtils/StateClasses.ts:71
