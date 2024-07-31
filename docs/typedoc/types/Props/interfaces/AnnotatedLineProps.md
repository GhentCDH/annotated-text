[**@ghentcdh/vue-component-annotated-text**](../../../README.md) • **Docs**

***

[@ghentcdh/vue-component-annotated-text](../../../modules.md) / [types/Props](../README.md) / AnnotatedLineProps

# Interface: AnnotatedLineProps

## Properties

### allowCreate?

> `optional` **allowCreate**: `boolean`

#### Defined in

types/Props.ts:146

***

### allowEdit?

> `optional` **allowEdit**: `boolean`

#### Defined in

types/Props.ts:145

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

types/Props.ts:130

***

### componentId

> **componentId**: `string`

#### Defined in

types/Props.ts:126

***

### line

> **line**: [`AnnotatedLine`](../../AnnotatedText/interfaces/AnnotatedLine.md)

#### Defined in

types/Props.ts:127

***

### onClickAnnotation()

> **onClickAnnotation**: (`annotation`, `mouseEvent`) => `void`

#### Parameters

• **annotation**: [`Annotation`](../../Annotation/interfaces/Annotation.md)

• **mouseEvent**: `any`

#### Returns

`void`

#### Defined in

types/Props.ts:136

***

### onMouseMove()

> **onMouseMove**: (`wordPart`, `mouseEvent`) => `void`

#### Parameters

• **wordPart**: [`WordPart`](../../AnnotatedText/interfaces/WordPart.md)

• **mouseEvent**: `MouseEvent`

#### Returns

`void`

#### Defined in

types/Props.ts:137

***

### onStartCreate()

> **onStartCreate**: (`mouseEvent`, `wordPartStart`) => `void`

#### Parameters

• **mouseEvent**: `MouseEvent`

• **wordPartStart**: `number`

#### Returns

`void`

#### Defined in

types/Props.ts:138

***

### onUpdateStart()

> **onUpdateStart**: (`mouseEvent`, `action`, `wordPartStart`, `annotation`) => `void`

#### Parameters

• **mouseEvent**: `MouseEvent`

• **action**: [`ActionType`](../../AnnotatedText/type-aliases/ActionType.md)

• **wordPartStart**: `number`

• **annotation**: [`Annotation`](../../Annotation/interfaces/Annotation.md)

#### Returns

`void`

#### Defined in

types/Props.ts:139

***

### render?

> `optional` **render**: [`RenderType`](../../AnnotatedText/type-aliases/RenderType.md)

#### Defined in

types/Props.ts:129

***

### wordPartClasses()?

> `optional` **wordPartClasses**: (`wordPart`) => `any`[]

#### Parameters

• **wordPart**: [`WordPart`](../../AnnotatedText/interfaces/WordPart.md)

#### Returns

`any`[]

#### Defined in

types/Props.ts:128
