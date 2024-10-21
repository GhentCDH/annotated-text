[@ghentcdh/vue-component-annotated-text](../globals.md) / AnnotatedLineProps

# Interface: AnnotatedLineProps

## Properties

### allowCreate?

> `optional` **allowCreate**: `boolean`

#### Defined in

[types/props/AnnotatedLineProps.ts:17](https://github.com/GhentCDH/vue_component_annotated_text/blob/59a5cff35d6965ffe0b2afa94949652f590d3fbd/src/types/props/AnnotatedLineProps.ts#L17)

***

### allowEdit?

> `optional` **allowEdit**: `boolean`

#### Defined in

[types/props/AnnotatedLineProps.ts:16](https://github.com/GhentCDH/vue_component_annotated_text/blob/59a5cff35d6965ffe0b2afa94949652f590d3fbd/src/types/props/AnnotatedLineProps.ts#L16)

***

### annotationClasses()?

> `optional` **annotationClasses**: (`annotation`, `start`, `end`, `allowCreate`) => `string`[]

#### Parameters

• **annotation**: `AnnotationInternal`

• **start**: `number`

• **end**: `number`

• **allowCreate**: `boolean`

#### Returns

`string`[]

#### Defined in

[types/props/AnnotatedLineProps.ts:9](https://github.com/GhentCDH/vue_component_annotated_text/blob/59a5cff35d6965ffe0b2afa94949652f590d3fbd/src/types/props/AnnotatedLineProps.ts#L9)

***

### annotationStyle()?

> `optional` **annotationStyle**: (`annotation`) => `string`[]

#### Parameters

• **annotation**: `AnnotationInternal`

#### Returns

`string`[]

#### Defined in

[types/props/AnnotatedLineProps.ts:15](https://github.com/GhentCDH/vue_component_annotated_text/blob/59a5cff35d6965ffe0b2afa94949652f590d3fbd/src/types/props/AnnotatedLineProps.ts#L15)

***

### line

> **line**: [`AnnotatedLine`](AnnotatedLine.md)

#### Defined in

[types/props/AnnotatedLineProps.ts:6](https://github.com/GhentCDH/vue_component_annotated_text/blob/59a5cff35d6965ffe0b2afa94949652f590d3fbd/src/types/props/AnnotatedLineProps.ts#L6)

***

### mouseDownHandler()

> **mouseDownHandler**: (`e`, `payload`?) => `void`

#### Parameters

• **e**: `MouseEvent`

• **payload?**: `MouseEventPayload`

#### Returns

`void`

#### Defined in

[types/props/AnnotatedLineProps.ts:19](https://github.com/GhentCDH/vue_component_annotated_text/blob/59a5cff35d6965ffe0b2afa94949652f590d3fbd/src/types/props/AnnotatedLineProps.ts#L19)

***

### mouseMoveHandler()

> **mouseMoveHandler**: (`e`, `payload`?) => `void`

#### Parameters

• **e**: `MouseEvent`

• **payload?**: `MouseEventPayload`

#### Returns

`void`

#### Defined in

[types/props/AnnotatedLineProps.ts:20](https://github.com/GhentCDH/vue_component_annotated_text/blob/59a5cff35d6965ffe0b2afa94949652f590d3fbd/src/types/props/AnnotatedLineProps.ts#L20)

***

### render?

> `optional` **render**: `RenderType`

#### Defined in

[types/props/AnnotatedLineProps.ts:8](https://github.com/GhentCDH/vue_component_annotated_text/blob/59a5cff35d6965ffe0b2afa94949652f590d3fbd/src/types/props/AnnotatedLineProps.ts#L8)

***

### wordPartClasses()?

> `optional` **wordPartClasses**: (`wordPart`) => `any`[]

#### Parameters

• **wordPart**: [`WordPart`](WordPart.md)

#### Returns

`any`[]

#### Defined in

[types/props/AnnotatedLineProps.ts:7](https://github.com/GhentCDH/vue_component_annotated_text/blob/59a5cff35d6965ffe0b2afa94949652f590d3fbd/src/types/props/AnnotatedLineProps.ts#L7)
