[@ghentcdh/vue-component-annotated-text](../globals.md) / RecursiveAnnotatedTokenPartTextProps

# Interface: RecursiveAnnotatedTokenPartTextProps

## Properties

### allowCreate?

> `optional` **allowCreate**: `boolean`

#### Defined in

[types/props/RecursiveAnnotatedTokenPartTextProps.ts:18](https://github.com/GhentCDH/vue_component_annotated_text/blob/10ad4fcd6799d0511ba161419ebd7d538a09bcc4/src/types/props/RecursiveAnnotatedTokenPartTextProps.ts#L18)

***

### allowEdit?

> `optional` **allowEdit**: `boolean`

#### Defined in

[types/props/RecursiveAnnotatedTokenPartTextProps.ts:17](https://github.com/GhentCDH/vue_component_annotated_text/blob/10ad4fcd6799d0511ba161419ebd7d538a09bcc4/src/types/props/RecursiveAnnotatedTokenPartTextProps.ts#L17)

***

### annotationClassHandler()?

> `optional` **annotationClassHandler**: (`annotation`, `start`, `end`, `allowCreate`) => `string`[]

#### Parameters

• **annotation**: [`Annotation`](Annotation.md)

• **start**: `number`

• **end**: `number`

• **allowCreate**: `boolean`

#### Returns

`string`[]

#### Defined in

[types/props/RecursiveAnnotatedTokenPartTextProps.ts:9](https://github.com/GhentCDH/vue_component_annotated_text/blob/10ad4fcd6799d0511ba161419ebd7d538a09bcc4/src/types/props/RecursiveAnnotatedTokenPartTextProps.ts#L9)

***

### annotations?

> `optional` **annotations**: [`Annotation`](Annotation.md)[]

#### Defined in

[types/props/RecursiveAnnotatedTokenPartTextProps.ts:8](https://github.com/GhentCDH/vue_component_annotated_text/blob/10ad4fcd6799d0511ba161419ebd7d538a09bcc4/src/types/props/RecursiveAnnotatedTokenPartTextProps.ts#L8)

***

### annotationStyleHandler()?

> `optional` **annotationStyleHandler**: (`annotation`) => `string`[]

#### Parameters

• **annotation**: [`Annotation`](Annotation.md)

#### Returns

`string`[]

#### Defined in

[types/props/RecursiveAnnotatedTokenPartTextProps.ts:15](https://github.com/GhentCDH/vue_component_annotated_text/blob/10ad4fcd6799d0511ba161419ebd7d538a09bcc4/src/types/props/RecursiveAnnotatedTokenPartTextProps.ts#L15)

***

### end

> **end**: `number`

#### Defined in

[types/props/RecursiveAnnotatedTokenPartTextProps.ts:7](https://github.com/GhentCDH/vue_component_annotated_text/blob/10ad4fcd6799d0511ba161419ebd7d538a09bcc4/src/types/props/RecursiveAnnotatedTokenPartTextProps.ts#L7)

***

### mouseDownHandler()

> **mouseDownHandler**: (`e`, `payload`?) => `void`

#### Parameters

• **e**: `MouseEvent`

• **payload?**: `MouseEventPayload`

#### Returns

`void`

#### Defined in

[types/props/RecursiveAnnotatedTokenPartTextProps.ts:20](https://github.com/GhentCDH/vue_component_annotated_text/blob/10ad4fcd6799d0511ba161419ebd7d538a09bcc4/src/types/props/RecursiveAnnotatedTokenPartTextProps.ts#L20)

***

### mouseMoveHandler()

> **mouseMoveHandler**: (`e`, `payload`?) => `void`

#### Parameters

• **e**: `MouseEvent`

• **payload?**: `MouseEventPayload`

#### Returns

`void`

#### Defined in

[types/props/RecursiveAnnotatedTokenPartTextProps.ts:21](https://github.com/GhentCDH/vue_component_annotated_text/blob/10ad4fcd6799d0511ba161419ebd7d538a09bcc4/src/types/props/RecursiveAnnotatedTokenPartTextProps.ts#L21)

***

### start

> **start**: `number`

#### Defined in

[types/props/RecursiveAnnotatedTokenPartTextProps.ts:6](https://github.com/GhentCDH/vue_component_annotated_text/blob/10ad4fcd6799d0511ba161419ebd7d538a09bcc4/src/types/props/RecursiveAnnotatedTokenPartTextProps.ts#L6)

***

### text

> **text**: `string`

#### Defined in

[types/props/RecursiveAnnotatedTokenPartTextProps.ts:5](https://github.com/GhentCDH/vue_component_annotated_text/blob/10ad4fcd6799d0511ba161419ebd7d538a09bcc4/src/types/props/RecursiveAnnotatedTokenPartTextProps.ts#L5)

***

### wordPartStart

> **wordPartStart**: `number`

#### Defined in

[types/props/RecursiveAnnotatedTokenPartTextProps.ts:16](https://github.com/GhentCDH/vue_component_annotated_text/blob/10ad4fcd6799d0511ba161419ebd7d538a09bcc4/src/types/props/RecursiveAnnotatedTokenPartTextProps.ts#L16)
