[**@ghentcdh/vue-component-annotated-text**](../../../README.md) • **Docs**

***

[@ghentcdh/vue-component-annotated-text](../../../modules.md) / [types/Props](../README.md) / AnnotatedLineProps

# Interface: AnnotatedLineProps

## Properties

### allowCreate?

> `optional` **allowCreate**: `boolean`

#### Defined in

[types/Props.ts:124](https://github.com/GhentCDH/vue_component_annotated_text/blob/d7f662fc6e4815223b2966a3f98cd4c1fa9a5954/src/types/Props.ts#L124)

***

### allowEdit?

> `optional` **allowEdit**: `boolean`

#### Defined in

[types/Props.ts:123](https://github.com/GhentCDH/vue_component_annotated_text/blob/d7f662fc6e4815223b2966a3f98cd4c1fa9a5954/src/types/Props.ts#L123)

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

[types/Props.ts:117](https://github.com/GhentCDH/vue_component_annotated_text/blob/d7f662fc6e4815223b2966a3f98cd4c1fa9a5954/src/types/Props.ts#L117)

***

### line

> **line**: [`AnnotatedLine`](../../AnnotatedText/interfaces/AnnotatedLine.md)

#### Defined in

[types/Props.ts:114](https://github.com/GhentCDH/vue_component_annotated_text/blob/d7f662fc6e4815223b2966a3f98cd4c1fa9a5954/src/types/Props.ts#L114)

***

### mouseDownHandler()

> **mouseDownHandler**: (`e`, `payload`?) => `void`

#### Parameters

• **e**: `MouseEvent`

• **payload?**: [`MouseEventPayload`](MouseEventPayload.md)

#### Returns

`void`

#### Defined in

[types/Props.ts:126](https://github.com/GhentCDH/vue_component_annotated_text/blob/d7f662fc6e4815223b2966a3f98cd4c1fa9a5954/src/types/Props.ts#L126)

***

### mouseMoveHandler()

> **mouseMoveHandler**: (`e`, `payload`?) => `void`

#### Parameters

• **e**: `MouseEvent`

• **payload?**: [`MouseEventPayload`](MouseEventPayload.md)

#### Returns

`void`

#### Defined in

[types/Props.ts:127](https://github.com/GhentCDH/vue_component_annotated_text/blob/d7f662fc6e4815223b2966a3f98cd4c1fa9a5954/src/types/Props.ts#L127)

***

### render?

> `optional` **render**: [`RenderType`](../../AnnotatedText/type-aliases/RenderType.md)

#### Defined in

[types/Props.ts:116](https://github.com/GhentCDH/vue_component_annotated_text/blob/d7f662fc6e4815223b2966a3f98cd4c1fa9a5954/src/types/Props.ts#L116)

***

### wordPartClasses()?

> `optional` **wordPartClasses**: (`wordPart`) => `any`[]

#### Parameters

• **wordPart**: [`WordPart`](../../AnnotatedText/interfaces/WordPart.md)

#### Returns

`any`[]

#### Defined in

[types/Props.ts:115](https://github.com/GhentCDH/vue_component_annotated_text/blob/d7f662fc6e4815223b2966a3f98cd4c1fa9a5954/src/types/Props.ts#L115)
