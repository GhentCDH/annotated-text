[@ghentcdh/vue-component-annotated-text](../globals.md) / CreateAnnotationState

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

[state/states/CreateAnnotationState.ts:15](https://github.com/GhentCDH/vue_component_annotated_text/blob/59a5cff35d6965ffe0b2afa94949652f590d3fbd/src/state/states/CreateAnnotationState.ts#L15)

## Properties

### annotation

> **annotation**: `AnnotationInternal`

#### Defined in

[state/states/CreateAnnotationState.ts:11](https://github.com/GhentCDH/vue_component_annotated_text/blob/59a5cff35d6965ffe0b2afa94949652f590d3fbd/src/state/states/CreateAnnotationState.ts#L11)

***

### creating

> **creating**: `boolean`

#### Defined in

[state/states/CreateAnnotationState.ts:12](https://github.com/GhentCDH/vue_component_annotated_text/blob/59a5cff35d6965ffe0b2afa94949652f590d3fbd/src/state/states/CreateAnnotationState.ts#L12)

***

### newEnd

> **newEnd**: `number`

#### Defined in

[state/states/CreateAnnotationState.ts:9](https://github.com/GhentCDH/vue_component_annotated_text/blob/59a5cff35d6965ffe0b2afa94949652f590d3fbd/src/state/states/CreateAnnotationState.ts#L9)

***

### newStart

> **newStart**: `number`

#### Defined in

[state/states/CreateAnnotationState.ts:10](https://github.com/GhentCDH/vue_component_annotated_text/blob/59a5cff35d6965ffe0b2afa94949652f590d3fbd/src/state/states/CreateAnnotationState.ts#L10)

***

### userState

> **userState**: [`UserState`](UserState.md)

#### Defined in

[state/states/CreateAnnotationState.ts:13](https://github.com/GhentCDH/vue_component_annotated_text/blob/59a5cff35d6965ffe0b2afa94949652f590d3fbd/src/state/states/CreateAnnotationState.ts#L13)

## Methods

### initAnnotation()

> **initAnnotation**(`annotation`): `void`

Initialise the annotation to be created.

#### Parameters

• **annotation**: `AnnotationInternal`

annotation object that the application can pass to use
as default init value.

#### Returns

`void`

#### Defined in

[state/states/CreateAnnotationState.ts:48](https://github.com/GhentCDH/vue_component_annotated_text/blob/59a5cff35d6965ffe0b2afa94949652f590d3fbd/src/state/states/CreateAnnotationState.ts#L48)

***

### resetCreating()

> **resetCreating**(): `void`

resets to the initial state

#### Returns

`void`

#### Defined in

[state/states/CreateAnnotationState.ts:23](https://github.com/GhentCDH/vue_component_annotated_text/blob/59a5cff35d6965ffe0b2afa94949652f590d3fbd/src/state/states/CreateAnnotationState.ts#L23)

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

[state/states/CreateAnnotationState.ts:37](https://github.com/GhentCDH/vue_component_annotated_text/blob/59a5cff35d6965ffe0b2afa94949652f590d3fbd/src/state/states/CreateAnnotationState.ts#L37)

***

### updateCreating()

> **updateCreating**(): `void`

Has to be called every time the mouse moves a character when creating an
annotation. If the application does not listen to onMove updates the
component will do this automatically.

#### Returns

`void`

#### Defined in

[state/states/CreateAnnotationState.ts:59](https://github.com/GhentCDH/vue_component_annotated_text/blob/59a5cff35d6965ffe0b2afa94949652f590d3fbd/src/state/states/CreateAnnotationState.ts#L59)
