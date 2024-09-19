[**@ghentcdh/vue-component-annotated-text**](../../../README.md) • **Docs**

***

[@ghentcdh/vue-component-annotated-text](../../../modules.md) / [types/Props](../README.md) / RecursiveAnnotatedTokenPartTextProps

# Interface: RecursiveAnnotatedTokenPartTextProps

## Properties

### allowCreate?

> `optional` **allowCreate**: `boolean`

#### Defined in

[types/Props.ts:87](https://github.com/GhentCDH/vue_component_annotated_text/blob/5675fc54077a4297a03f45161e62f99e3d8b3eba/src/types/Props.ts#L87)

***

### allowEdit?

> `optional` **allowEdit**: `boolean`

#### Defined in

[types/Props.ts:86](https://github.com/GhentCDH/vue_component_annotated_text/blob/5675fc54077a4297a03f45161e62f99e3d8b3eba/src/types/Props.ts#L86)

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

[types/Props.ts:79](https://github.com/GhentCDH/vue_component_annotated_text/blob/5675fc54077a4297a03f45161e62f99e3d8b3eba/src/types/Props.ts#L79)

***

### annotations?

> `optional` **annotations**: [`Annotation`](../../Annotation/interfaces/Annotation.md)[]

#### Defined in

[types/Props.ts:78](https://github.com/GhentCDH/vue_component_annotated_text/blob/5675fc54077a4297a03f45161e62f99e3d8b3eba/src/types/Props.ts#L78)

***

### end

> **end**: `number`

#### Defined in

[types/Props.ts:77](https://github.com/GhentCDH/vue_component_annotated_text/blob/5675fc54077a4297a03f45161e62f99e3d8b3eba/src/types/Props.ts#L77)

***

### mouseDownHandler()

> **mouseDownHandler**: (`e`, `payload`?) => `void`

#### Parameters

• **e**: `MouseEvent`

• **payload?**: [`MouseEventPayload`](MouseEventPayload.md)

#### Returns

`void`

#### Defined in

[types/Props.ts:89](https://github.com/GhentCDH/vue_component_annotated_text/blob/5675fc54077a4297a03f45161e62f99e3d8b3eba/src/types/Props.ts#L89)

***

### mouseMoveHandler()

> **mouseMoveHandler**: (`e`, `payload`?) => `void`

#### Parameters

• **e**: `MouseEvent`

• **payload?**: [`MouseEventPayload`](MouseEventPayload.md)

#### Returns

`void`

#### Defined in

[types/Props.ts:90](https://github.com/GhentCDH/vue_component_annotated_text/blob/5675fc54077a4297a03f45161e62f99e3d8b3eba/src/types/Props.ts#L90)

***

### start

> **start**: `number`

#### Defined in

[types/Props.ts:76](https://github.com/GhentCDH/vue_component_annotated_text/blob/5675fc54077a4297a03f45161e62f99e3d8b3eba/src/types/Props.ts#L76)

***

### text

> **text**: `string`

#### Defined in

[types/Props.ts:75](https://github.com/GhentCDH/vue_component_annotated_text/blob/5675fc54077a4297a03f45161e62f99e3d8b3eba/src/types/Props.ts#L75)

***

### wordPartStart

> **wordPartStart**: `number`

#### Defined in

[types/Props.ts:85](https://github.com/GhentCDH/vue_component_annotated_text/blob/5675fc54077a4297a03f45161e62f99e3d8b3eba/src/types/Props.ts#L85)
