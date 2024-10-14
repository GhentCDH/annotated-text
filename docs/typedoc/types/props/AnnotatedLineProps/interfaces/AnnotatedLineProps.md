[**@ghentcdh/vue-component-annotated-text**](../../../../README.md) • **Docs**

***

[@ghentcdh/vue-component-annotated-text](../../../../modules.md) / [types/props/AnnotatedLineProps](../README.md) / AnnotatedLineProps

# Interface: AnnotatedLineProps

## Properties

### allowCreate?

> `optional` **allowCreate**: `boolean`

#### Defined in

[src/types/props/AnnotatedLineProps.ts:17](https://github.com/GhentCDH/vue_component_annotated_text/blob/bbd5dc841c855a8533eb4b63ec1d23dd4ebf9e1d/src/types/props/AnnotatedLineProps.ts#L17)

***

### allowEdit?

> `optional` **allowEdit**: `boolean`

#### Defined in

[src/types/props/AnnotatedLineProps.ts:16](https://github.com/GhentCDH/vue_component_annotated_text/blob/bbd5dc841c855a8533eb4b63ec1d23dd4ebf9e1d/src/types/props/AnnotatedLineProps.ts#L16)

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

[src/types/props/AnnotatedLineProps.ts:9](https://github.com/GhentCDH/vue_component_annotated_text/blob/bbd5dc841c855a8533eb4b63ec1d23dd4ebf9e1d/src/types/props/AnnotatedLineProps.ts#L9)

***

### annotationStyle()?

> `optional` **annotationStyle**: (`annotation`) => `string`[]

#### Parameters

• **annotation**: [`Annotation`](../../../Annotation/interfaces/Annotation.md)

#### Returns

`string`[]

#### Defined in

[src/types/props/AnnotatedLineProps.ts:15](https://github.com/GhentCDH/vue_component_annotated_text/blob/bbd5dc841c855a8533eb4b63ec1d23dd4ebf9e1d/src/types/props/AnnotatedLineProps.ts#L15)

***

### line

> **line**: [`AnnotatedLine`](../../../AnnotatedText/interfaces/AnnotatedLine.md)

#### Defined in

[src/types/props/AnnotatedLineProps.ts:6](https://github.com/GhentCDH/vue_component_annotated_text/blob/bbd5dc841c855a8533eb4b63ec1d23dd4ebf9e1d/src/types/props/AnnotatedLineProps.ts#L6)

***

### mouseDownHandler()

> **mouseDownHandler**: (`e`, `payload`?) => `void`

#### Parameters

• **e**: `MouseEvent`

• **payload?**: [`MouseEventPayload`](../../MouseEventPayload/interfaces/MouseEventPayload.md)

#### Returns

`void`

#### Defined in

[src/types/props/AnnotatedLineProps.ts:19](https://github.com/GhentCDH/vue_component_annotated_text/blob/bbd5dc841c855a8533eb4b63ec1d23dd4ebf9e1d/src/types/props/AnnotatedLineProps.ts#L19)

***

### mouseMoveHandler()

> **mouseMoveHandler**: (`e`, `payload`?) => `void`

#### Parameters

• **e**: `MouseEvent`

• **payload?**: [`MouseEventPayload`](../../MouseEventPayload/interfaces/MouseEventPayload.md)

#### Returns

`void`

#### Defined in

[src/types/props/AnnotatedLineProps.ts:20](https://github.com/GhentCDH/vue_component_annotated_text/blob/bbd5dc841c855a8533eb4b63ec1d23dd4ebf9e1d/src/types/props/AnnotatedLineProps.ts#L20)

***

### render?

> `optional` **render**: [`RenderType`](../../../AnnotatedText/type-aliases/RenderType.md)

#### Defined in

[src/types/props/AnnotatedLineProps.ts:8](https://github.com/GhentCDH/vue_component_annotated_text/blob/bbd5dc841c855a8533eb4b63ec1d23dd4ebf9e1d/src/types/props/AnnotatedLineProps.ts#L8)

***

### wordPartClasses()?

> `optional` **wordPartClasses**: (`wordPart`) => `any`[]

#### Parameters

• **wordPart**: [`WordPart`](../../../AnnotatedText/interfaces/WordPart.md)

#### Returns

`any`[]

#### Defined in

[src/types/props/AnnotatedLineProps.ts:7](https://github.com/GhentCDH/vue_component_annotated_text/blob/bbd5dc841c855a8533eb4b63ec1d23dd4ebf9e1d/src/types/props/AnnotatedLineProps.ts#L7)
