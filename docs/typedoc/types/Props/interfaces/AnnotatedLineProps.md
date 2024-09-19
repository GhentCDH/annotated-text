[**@ghentcdh/vue-component-annotated-text**](../../../README.md) • **Docs**

***

[@ghentcdh/vue-component-annotated-text](../../../modules.md) / [types/Props](../README.md) / AnnotatedLineProps

# Interface: AnnotatedLineProps

## Properties

### allowCreate?

> `optional` **allowCreate**: `boolean`

#### Defined in

[types/Props.ts:104](https://github.com/GhentCDH/vue_component_annotated_text/blob/5675fc54077a4297a03f45161e62f99e3d8b3eba/src/types/Props.ts#L104)

***

### allowEdit?

> `optional` **allowEdit**: `boolean`

#### Defined in

[types/Props.ts:103](https://github.com/GhentCDH/vue_component_annotated_text/blob/5675fc54077a4297a03f45161e62f99e3d8b3eba/src/types/Props.ts#L103)

***

### annotationClasses()?

> `optional` **annotationClasses**: (`annotation`, `start`, `end`, `allowCreate`) => `string`[]

#### Parameters

• **annotation**: [`Annotation`](../../Annotation/interfaces/Annotation.md)

• **start**: `number`

• **end**: `number`

• **allowCreate**: `boolean`

#### Returns

`string`[]

#### Defined in

[types/Props.ts:97](https://github.com/GhentCDH/vue_component_annotated_text/blob/5675fc54077a4297a03f45161e62f99e3d8b3eba/src/types/Props.ts#L97)

***

### line

> **line**: [`AnnotatedLine`](../../AnnotatedText/interfaces/AnnotatedLine.md)

#### Defined in

[types/Props.ts:94](https://github.com/GhentCDH/vue_component_annotated_text/blob/5675fc54077a4297a03f45161e62f99e3d8b3eba/src/types/Props.ts#L94)

***

### mouseDownHandler()

> **mouseDownHandler**: (`e`, `payload`?) => `void`

#### Parameters

• **e**: `MouseEvent`

• **payload?**: [`MouseEventPayload`](MouseEventPayload.md)

#### Returns

`void`

#### Defined in

[types/Props.ts:106](https://github.com/GhentCDH/vue_component_annotated_text/blob/5675fc54077a4297a03f45161e62f99e3d8b3eba/src/types/Props.ts#L106)

***

### mouseMoveHandler()

> **mouseMoveHandler**: (`e`, `payload`?) => `void`

#### Parameters

• **e**: `MouseEvent`

• **payload?**: [`MouseEventPayload`](MouseEventPayload.md)

#### Returns

`void`

#### Defined in

[types/Props.ts:107](https://github.com/GhentCDH/vue_component_annotated_text/blob/5675fc54077a4297a03f45161e62f99e3d8b3eba/src/types/Props.ts#L107)

***

### render?

> `optional` **render**: [`RenderType`](../../AnnotatedText/type-aliases/RenderType.md)

#### Defined in

[types/Props.ts:96](https://github.com/GhentCDH/vue_component_annotated_text/blob/5675fc54077a4297a03f45161e62f99e3d8b3eba/src/types/Props.ts#L96)

***

### wordPartClasses()?

> `optional` **wordPartClasses**: (`wordPart`) => `any`[]

#### Parameters

• **wordPart**: [`WordPart`](../../AnnotatedText/interfaces/WordPart.md)

#### Returns

`any`[]

#### Defined in

[types/Props.ts:95](https://github.com/GhentCDH/vue_component_annotated_text/blob/5675fc54077a4297a03f45161e62f99e3d8b3eba/src/types/Props.ts#L95)
