[**@ghentcdh/vue-component-annotated-text**](../../../README.md) • **Docs**

***

[@ghentcdh/vue-component-annotated-text](../../../modules.md) / [types/Props](../README.md) / RecursiveAnnotatedTokenPartTextProps

# Interface: RecursiveAnnotatedTokenPartTextProps

## Properties

### allowCreate?

> `optional` **allowCreate**: `boolean`

#### Defined in

types/Props.ts:122

***

### allowEdit?

> `optional` **allowEdit**: `boolean`

#### Defined in

types/Props.ts:121

***

### annotationClassHandler()?

> `optional` **annotationClassHandler**: (`annotation`, `start`, `end`, `allowCreate`) => `string`[]

#### Parameters

• **annotation**: [`Annotation`](../../Annotation/interfaces/Annotation.md)

• **start**: `number`

• **end**: `number`

• **allowCreate**: `boolean`

#### Returns

`string`[]

#### Defined in

types/Props.ts:104

***

### annotationClickHandler()

> **annotationClickHandler**: (`annotation`, `mouseEvent`) => `void`

#### Parameters

• **annotation**: [`Annotation`](../../Annotation/interfaces/Annotation.md)

• **mouseEvent**: `MouseEvent`

#### Returns

`void`

#### Defined in

types/Props.ts:116

***

### annotations?

> `optional` **annotations**: [`Annotation`](../../Annotation/interfaces/Annotation.md)[]

#### Defined in

types/Props.ts:103

***

### componentId

> **componentId**: `string`

#### Defined in

types/Props.ts:99

***

### end

> **end**: `number`

#### Defined in

types/Props.ts:102

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

types/Props.ts:110

***

### start

> **start**: `number`

#### Defined in

types/Props.ts:101

***

### text

> **text**: `string`

#### Defined in

types/Props.ts:100

***

### wordPartStart

> **wordPartStart**: `number`

#### Defined in

types/Props.ts:120
