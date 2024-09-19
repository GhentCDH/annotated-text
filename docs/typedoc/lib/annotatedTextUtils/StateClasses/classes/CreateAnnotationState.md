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

[lib/annotatedTextUtils/StateClasses.ts:147](https://github.com/GhentCDH/vue_component_annotated_text/blob/5675fc54077a4297a03f45161e62f99e3d8b3eba/src/lib/annotatedTextUtils/StateClasses.ts#L147)

## Properties

### annotation

> **annotation**: [`Annotation`](../../../../types/Annotation/interfaces/Annotation.md)

#### Defined in

[lib/annotatedTextUtils/StateClasses.ts:143](https://github.com/GhentCDH/vue_component_annotated_text/blob/5675fc54077a4297a03f45161e62f99e3d8b3eba/src/lib/annotatedTextUtils/StateClasses.ts#L143)

***

### creating

> **creating**: `boolean`

#### Defined in

[lib/annotatedTextUtils/StateClasses.ts:144](https://github.com/GhentCDH/vue_component_annotated_text/blob/5675fc54077a4297a03f45161e62f99e3d8b3eba/src/lib/annotatedTextUtils/StateClasses.ts#L144)

***

### newEnd

> **newEnd**: `number`

#### Defined in

[lib/annotatedTextUtils/StateClasses.ts:141](https://github.com/GhentCDH/vue_component_annotated_text/blob/5675fc54077a4297a03f45161e62f99e3d8b3eba/src/lib/annotatedTextUtils/StateClasses.ts#L141)

***

### newStart

> **newStart**: `number`

#### Defined in

[lib/annotatedTextUtils/StateClasses.ts:142](https://github.com/GhentCDH/vue_component_annotated_text/blob/5675fc54077a4297a03f45161e62f99e3d8b3eba/src/lib/annotatedTextUtils/StateClasses.ts#L142)

***

### userState

> **userState**: [`UserState`](UserState.md)

#### Defined in

[lib/annotatedTextUtils/StateClasses.ts:145](https://github.com/GhentCDH/vue_component_annotated_text/blob/5675fc54077a4297a03f45161e62f99e3d8b3eba/src/lib/annotatedTextUtils/StateClasses.ts#L145)

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

[lib/annotatedTextUtils/StateClasses.ts:180](https://github.com/GhentCDH/vue_component_annotated_text/blob/5675fc54077a4297a03f45161e62f99e3d8b3eba/src/lib/annotatedTextUtils/StateClasses.ts#L180)

***

### resetCreating()

> **resetCreating**(): `void`

resets to the initial state

#### Returns

`void`

#### Defined in

[lib/annotatedTextUtils/StateClasses.ts:155](https://github.com/GhentCDH/vue_component_annotated_text/blob/5675fc54077a4297a03f45161e62f99e3d8b3eba/src/lib/annotatedTextUtils/StateClasses.ts#L155)

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

[lib/annotatedTextUtils/StateClasses.ts:169](https://github.com/GhentCDH/vue_component_annotated_text/blob/5675fc54077a4297a03f45161e62f99e3d8b3eba/src/lib/annotatedTextUtils/StateClasses.ts#L169)

***

### updateCreating()

> **updateCreating**(): `void`

Has to be called every time the mouse moves a character when creating an
annotation. If the application does not listen to onMove updates the
component will do this automatically.

#### Returns

`void`

#### Defined in

[lib/annotatedTextUtils/StateClasses.ts:191](https://github.com/GhentCDH/vue_component_annotated_text/blob/5675fc54077a4297a03f45161e62f99e3d8b3eba/src/lib/annotatedTextUtils/StateClasses.ts#L191)
