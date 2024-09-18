[**@ghentcdh/vue-component-annotated-text**](../../../README.md) • **Docs**

***

[@ghentcdh/vue-component-annotated-text](../../../modules.md) / [types/Props](../README.md) / RecursiveAnnotatedTokenPartTextProps

# Interface: RecursiveAnnotatedTokenPartTextProps

## Properties

### allowCreate?

> `optional` **allowCreate**: `boolean`

#### Defined in

[types/Props.ts:107](https://github.com/GhentCDH/vue_component_annotated_text/blob/d7f662fc6e4815223b2966a3f98cd4c1fa9a5954/src/types/Props.ts#L107)

***

### allowEdit?

> `optional` **allowEdit**: `boolean`

#### Defined in

[types/Props.ts:106](https://github.com/GhentCDH/vue_component_annotated_text/blob/d7f662fc6e4815223b2966a3f98cd4c1fa9a5954/src/types/Props.ts#L106)

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

[types/Props.ts:99](https://github.com/GhentCDH/vue_component_annotated_text/blob/d7f662fc6e4815223b2966a3f98cd4c1fa9a5954/src/types/Props.ts#L99)

***

### annotations?

> `optional` **annotations**: [`Annotation`](../../Annotation/interfaces/Annotation.md)[]

#### Defined in

[types/Props.ts:98](https://github.com/GhentCDH/vue_component_annotated_text/blob/d7f662fc6e4815223b2966a3f98cd4c1fa9a5954/src/types/Props.ts#L98)

***

### end

> **end**: `number`

#### Defined in

[types/Props.ts:97](https://github.com/GhentCDH/vue_component_annotated_text/blob/d7f662fc6e4815223b2966a3f98cd4c1fa9a5954/src/types/Props.ts#L97)

***

### mouseDownHandler()

> **mouseDownHandler**: (`e`, `payload`?) => `void`

#### Parameters

• **e**: `MouseEvent`

• **payload?**: [`MouseEventPayload`](MouseEventPayload.md)

#### Returns

`void`

#### Defined in

[types/Props.ts:109](https://github.com/GhentCDH/vue_component_annotated_text/blob/d7f662fc6e4815223b2966a3f98cd4c1fa9a5954/src/types/Props.ts#L109)

***

### mouseMoveHandler()

> **mouseMoveHandler**: (`e`, `payload`?) => `void`

#### Parameters

• **e**: `MouseEvent`

• **payload?**: [`MouseEventPayload`](MouseEventPayload.md)

#### Returns

`void`

#### Defined in

[types/Props.ts:110](https://github.com/GhentCDH/vue_component_annotated_text/blob/d7f662fc6e4815223b2966a3f98cd4c1fa9a5954/src/types/Props.ts#L110)

***

### start

> **start**: `number`

#### Defined in

[types/Props.ts:96](https://github.com/GhentCDH/vue_component_annotated_text/blob/d7f662fc6e4815223b2966a3f98cd4c1fa9a5954/src/types/Props.ts#L96)

***

### text

> **text**: `string`

#### Defined in

[types/Props.ts:95](https://github.com/GhentCDH/vue_component_annotated_text/blob/d7f662fc6e4815223b2966a3f98cd4c1fa9a5954/src/types/Props.ts#L95)

***

### wordPartStart

> **wordPartStart**: `number`

#### Defined in

[types/Props.ts:105](https://github.com/GhentCDH/vue_component_annotated_text/blob/d7f662fc6e4815223b2966a3f98cd4c1fa9a5954/src/types/Props.ts#L105)
