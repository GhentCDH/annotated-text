[**@ghentcdh/vue-component-annotated-text**](../../../../README.md) • **Docs**

***

[@ghentcdh/vue-component-annotated-text](../../../../modules.md) / [types/props/AnnotatedTextProps](../README.md) / AnnotatedTextProps

# Interface: AnnotatedTextProps

## Properties

### allowCreate?

> `optional` **allowCreate**: `boolean`

Whether to allow creating new annotations

#### Defined in

[src/types/props/AnnotatedTextProps.ts:64](https://github.com/GhentCDH/vue_component_annotated_text/blob/bbd5dc841c855a8533eb4b63ec1d23dd4ebf9e1d/src/types/props/AnnotatedTextProps.ts#L64)

***

### allowEdit?

> `optional` **allowEdit**: `boolean`

Whether to allow editing annotations

#### Defined in

[src/types/props/AnnotatedTextProps.ts:60](https://github.com/GhentCDH/vue_component_annotated_text/blob/bbd5dc841c855a8533eb4b63ec1d23dd4ebf9e1d/src/types/props/AnnotatedTextProps.ts#L60)

***

### ~~annotationOffset?~~

> `optional` **annotationOffset**: `number`

#### Deprecated

#### Defined in

[src/types/props/AnnotatedTextProps.ts:24](https://github.com/GhentCDH/vue_component_annotated_text/blob/bbd5dc841c855a8533eb4b63ec1d23dd4ebf9e1d/src/types/props/AnnotatedTextProps.ts#L24)

***

### annotations?

> `optional` **annotations**: [`Annotation`](../../../Annotation/interfaces/Annotation.md)[]

List of annotations to be displayed

#### Defined in

[src/types/props/AnnotatedTextProps.ts:8](https://github.com/GhentCDH/vue_component_annotated_text/blob/bbd5dc841c855a8533eb4b63ec1d23dd4ebf9e1d/src/types/props/AnnotatedTextProps.ts#L8)

***

### autoAnnotationWeights?

> `optional` **autoAnnotationWeights**: `boolean`

Whether to automatically calculate weights

#### Defined in

[src/types/props/AnnotatedTextProps.ts:52](https://github.com/GhentCDH/vue_component_annotated_text/blob/bbd5dc841c855a8533eb4b63ec1d23dd4ebf9e1d/src/types/props/AnnotatedTextProps.ts#L52)

***

### debug?

> `optional` **debug**: `boolean`

Whether verbose debug messages are printed

#### Defined in

[src/types/props/AnnotatedTextProps.ts:28](https://github.com/GhentCDH/vue_component_annotated_text/blob/bbd5dc841c855a8533eb4b63ec1d23dd4ebf9e1d/src/types/props/AnnotatedTextProps.ts#L28)

***

### display?

> `optional` **display**: [`AnnotationTarget`](../../../Annotation/type-aliases/AnnotationTarget.md)

Whether to display text or gutter annotations

#### Defined in

[src/types/props/AnnotatedTextProps.ts:44](https://github.com/GhentCDH/vue_component_annotated_text/blob/bbd5dc841c855a8533eb4b63ec1d23dd4ebf9e1d/src/types/props/AnnotatedTextProps.ts#L44)

***

### hoveredAnnotations?

> `optional` **hoveredAnnotations**: `string`[]

List of annotation ID's that are hovered. Those will get the "hovered" style class.

#### Defined in

[src/types/props/AnnotatedTextProps.ts:16](https://github.com/GhentCDH/vue_component_annotated_text/blob/bbd5dc841c855a8533eb4b63ec1d23dd4ebf9e1d/src/types/props/AnnotatedTextProps.ts#L16)

***

### lines

> **lines**: [`Line`](../../../AnnotatedText/interfaces/Line.md)[]

List of lines

#### Defined in

[src/types/props/AnnotatedTextProps.ts:20](https://github.com/GhentCDH/vue_component_annotated_text/blob/bbd5dc841c855a8533eb4b63ec1d23dd4ebf9e1d/src/types/props/AnnotatedTextProps.ts#L20)

***

### ~~render?~~

> `optional` **render**: [`RenderType`](../../../AnnotatedText/type-aliases/RenderType.md)

#### Deprecated

#### Defined in

[src/types/props/AnnotatedTextProps.ts:40](https://github.com/GhentCDH/vue_component_annotated_text/blob/bbd5dc841c855a8533eb4b63ec1d23dd4ebf9e1d/src/types/props/AnnotatedTextProps.ts#L40)

***

### selectedAnnotations?

> `optional` **selectedAnnotations**: `string`[]

List of annotation ID's that are selected. Those will get the "active" style class

#### Defined in

[src/types/props/AnnotatedTextProps.ts:12](https://github.com/GhentCDH/vue_component_annotated_text/blob/bbd5dc841c855a8533eb4b63ec1d23dd4ebf9e1d/src/types/props/AnnotatedTextProps.ts#L12)

***

### showLabels?

> `optional` **showLabels**: `boolean`

Whether to show the labels

#### Defined in

[src/types/props/AnnotatedTextProps.ts:48](https://github.com/GhentCDH/vue_component_annotated_text/blob/bbd5dc841c855a8533eb4b63ec1d23dd4ebf9e1d/src/types/props/AnnotatedTextProps.ts#L48)

***

### style?

> `optional` **style**: [`AnnotationStyle`](../../../AnnotatedText/interfaces/AnnotationStyle.md)

Object to define classes for styles.

#### Defined in

[src/types/props/AnnotatedTextProps.ts:56](https://github.com/GhentCDH/vue_component_annotated_text/blob/bbd5dc841c855a8533eb4b63ec1d23dd4ebf9e1d/src/types/props/AnnotatedTextProps.ts#L56)

***

### theme?

> `optional` **theme**: `string`

only default theme available for now

#### Defined in

[src/types/props/AnnotatedTextProps.ts:36](https://github.com/GhentCDH/vue_component_annotated_text/blob/bbd5dc841c855a8533eb4b63ec1d23dd4ebf9e1d/src/types/props/AnnotatedTextProps.ts#L36)

***

### verbose?

> `optional` **verbose**: `boolean`

Whether event messages are printed

#### Defined in

[src/types/props/AnnotatedTextProps.ts:32](https://github.com/GhentCDH/vue_component_annotated_text/blob/bbd5dc841c855a8533eb4b63ec1d23dd4ebf9e1d/src/types/props/AnnotatedTextProps.ts#L32)
