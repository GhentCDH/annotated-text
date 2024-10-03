[**@ghentcdh/vue-component-annotated-text**](../../../../README.md) • **Docs**

***

[@ghentcdh/vue-component-annotated-text](../../../../modules.md) / [types/props/AnnotatedLineProps](../README.md) / AnnotatedLineProps

# Interface: AnnotatedLineProps

## Properties

### allowCreate?

> `optional` **allowCreate**: `boolean`

#### Defined in

[types/props/AnnotatedLineProps.ts:16](https://github.com/GhentCDH/vue_component_annotated_text/blob/6add7bb10a77b5452736ad4c56c99391d8dec5bd/src/types/props/AnnotatedLineProps.ts#L16)

***

### allowEdit?

> `optional` **allowEdit**: `boolean`

#### Defined in

[types/props/AnnotatedLineProps.ts:15](https://github.com/GhentCDH/vue_component_annotated_text/blob/6add7bb10a77b5452736ad4c56c99391d8dec5bd/src/types/props/AnnotatedLineProps.ts#L15)

***

### annotationClasses()?

> `optional` **annotationClasses**: (`annotation`, `start`, `end`, `allowCreate`) => `string`[]

#### Parameters

• **annotation**: [`Annotation`](../../../Annotation/interfaces/Annotation.md)

• **start**: `number`

• **end**: `number`

• **allowCreate**: `boolean`

#### Returns

`string`[]

#### Defined in

[types/props/AnnotatedLineProps.ts:9](https://github.com/GhentCDH/vue_component_annotated_text/blob/6add7bb10a77b5452736ad4c56c99391d8dec5bd/src/types/props/AnnotatedLineProps.ts#L9)

***

### line

> **line**: [`AnnotatedLine`](../../../AnnotatedText/interfaces/AnnotatedLine.md)

#### Defined in

[types/props/AnnotatedLineProps.ts:6](https://github.com/GhentCDH/vue_component_annotated_text/blob/6add7bb10a77b5452736ad4c56c99391d8dec5bd/src/types/props/AnnotatedLineProps.ts#L6)

***

### mouseDownHandler()

> **mouseDownHandler**: (`e`, `payload`?) => `void`

#### Parameters

• **e**: `MouseEvent`

• **payload?**: [`MouseEventPayload`](../../MouseEventPayload/interfaces/MouseEventPayload.md)

#### Returns

`void`

#### Defined in

[types/props/AnnotatedLineProps.ts:18](https://github.com/GhentCDH/vue_component_annotated_text/blob/6add7bb10a77b5452736ad4c56c99391d8dec5bd/src/types/props/AnnotatedLineProps.ts#L18)

***

### mouseMoveHandler()

> **mouseMoveHandler**: (`e`, `payload`?) => `void`

#### Parameters

• **e**: `MouseEvent`

• **payload?**: [`MouseEventPayload`](../../MouseEventPayload/interfaces/MouseEventPayload.md)

#### Returns

`void`

#### Defined in

[types/props/AnnotatedLineProps.ts:19](https://github.com/GhentCDH/vue_component_annotated_text/blob/6add7bb10a77b5452736ad4c56c99391d8dec5bd/src/types/props/AnnotatedLineProps.ts#L19)

***

### render?

> `optional` **render**: [`RenderType`](../../../AnnotatedText/type-aliases/RenderType.md)

#### Defined in

[types/props/AnnotatedLineProps.ts:8](https://github.com/GhentCDH/vue_component_annotated_text/blob/6add7bb10a77b5452736ad4c56c99391d8dec5bd/src/types/props/AnnotatedLineProps.ts#L8)

***

### wordPartClasses()?

> `optional` **wordPartClasses**: (`wordPart`) => `any`[]

#### Parameters

• **wordPart**: [`WordPart`](../../../AnnotatedText/interfaces/WordPart.md)

#### Returns

`any`[]

#### Defined in

[types/props/AnnotatedLineProps.ts:7](https://github.com/GhentCDH/vue_component_annotated_text/blob/6add7bb10a77b5452736ad4c56c99391d8dec5bd/src/types/props/AnnotatedLineProps.ts#L7)
