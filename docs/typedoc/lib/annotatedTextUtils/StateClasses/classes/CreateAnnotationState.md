[**@ghentcdh/vue-component-annotated-text**](../../../../README.md) • **Docs**

***

[@ghentcdh/vue-component-annotated-text](../../../../modules.md) / [lib/annotatedTextUtils/StateClasses](../README.md) / CreateAnnotationState

# Class: CreateAnnotationState

Class holding the state of an annotation being created

## Constructors

### new CreateAnnotationState()

> **new CreateAnnotationState**(`userState`): [`CreateAnnotationState`](CreateAnnotationState.md)

#### Parameters

• **userState**: [`UserState`](UserState.md)

#### Returns

[`CreateAnnotationState`](CreateAnnotationState.md)

#### Defined in

lib/annotatedTextUtils/StateClasses.ts:136

## Properties

### annotation

> **annotation**: [`Annotation`](../../../../types/Annotation/interfaces/Annotation.md)

#### Defined in

lib/annotatedTextUtils/StateClasses.ts:132

***

### creating

> **creating**: `boolean`

#### Defined in

lib/annotatedTextUtils/StateClasses.ts:133

***

### newEnd

> **newEnd**: `number`

#### Defined in

lib/annotatedTextUtils/StateClasses.ts:130

***

### newStart

> **newStart**: `number`

#### Defined in

lib/annotatedTextUtils/StateClasses.ts:131

***

### userState

> **userState**: [`UserState`](UserState.md)

#### Defined in

lib/annotatedTextUtils/StateClasses.ts:134

## Methods

### initAnnotation()

> **initAnnotation**(`annotation`): `void`

Initialise the annotation to be created.

#### Parameters

• **annotation**: [`Annotation`](../../../../types/Annotation/interfaces/Annotation.md)

annotation object that the application can pass to use
as default init value.

#### Returns

`void`

#### Defined in

lib/annotatedTextUtils/StateClasses.ts:169

***

### resetCreating()

> **resetCreating**(): `void`

resets to the initial state

#### Returns

`void`

#### Defined in

lib/annotatedTextUtils/StateClasses.ts:144

***

### startCreating()

> **startCreating**(`start`): `void`

start creating an annotation

#### Parameters

• **start**: `number`

position where the creation starts. The end position will not
be able to be before this starting position.

#### Returns

`void`

#### Defined in

lib/annotatedTextUtils/StateClasses.ts:158

***

### updateCreating()

> **updateCreating**(): `void`

Has to be called every time the mouse moves a character when creating an
annotation. If the application does not listen to onMove updates the
component will do this automatically.

#### Returns

`void`

#### Defined in

lib/annotatedTextUtils/StateClasses.ts:180
