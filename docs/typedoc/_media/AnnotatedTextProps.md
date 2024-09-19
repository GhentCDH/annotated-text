[**@ghentcdh/vue-component-annotated-text**](../../../README.md) • **Docs**

***

[@ghentcdh/vue-component-annotated-text](../../../modules.md) / [types/Props](../README.md) / AnnotatedTextProps

# Interface: AnnotatedTextProps

## Properties

### allowCreate?

> `optional` **allowCreate**: `boolean`

Whether to allow creating new annotations

#### Defined in

[types/Props.ts:71](https://github.com/GhentCDH/vue_component_annotated_text/blob/5675fc54077a4297a03f45161e62f99e3d8b3eba/src/types/Props.ts#L71)

***

### allowEdit?

> `optional` **allowEdit**: `boolean`

Whether to allow editing annotations

#### Defined in

[types/Props.ts:67](https://github.com/GhentCDH/vue_component_annotated_text/blob/5675fc54077a4297a03f45161e62f99e3d8b3eba/src/types/Props.ts#L67)

***

### ~~annotationOffset?~~

> `optional` **annotationOffset**: `number`

#### Deprecated

#### Defined in

[types/Props.ts:31](https://github.com/GhentCDH/vue_component_annotated_text/blob/5675fc54077a4297a03f45161e62f99e3d8b3eba/src/types/Props.ts#L31)

***

### annotations?

> `optional` **annotations**: [`Annotation`](../../Annotation/interfaces/Annotation.md)[]

List of annotations to be displayed

#### Defined in

[types/Props.ts:15](https://github.com/GhentCDH/vue_component_annotated_text/blob/5675fc54077a4297a03f45161e62f99e3d8b3eba/src/types/Props.ts#L15)

***

### autoAnnotationWeights?

> `optional` **autoAnnotationWeights**: `boolean`

Whether to automatically calculate weights

#### Defined in

[types/Props.ts:59](https://github.com/GhentCDH/vue_component_annotated_text/blob/5675fc54077a4297a03f45161e62f99e3d8b3eba/src/types/Props.ts#L59)

***

### debug?

> `optional` **debug**: `boolean`

Whether verbose debug messages are printed

#### Defined in

[types/Props.ts:35](https://github.com/GhentCDH/vue_component_annotated_text/blob/5675fc54077a4297a03f45161e62f99e3d8b3eba/src/types/Props.ts#L35)

***

### display?

> `optional` **display**: [`AnnotationTarget`](../../Annotation/type-aliases/AnnotationTarget.md)

Whether to display text or gutter annotations

#### Defined in

[types/Props.ts:51](https://github.com/GhentCDH/vue_component_annotated_text/blob/5675fc54077a4297a03f45161e62f99e3d8b3eba/src/types/Props.ts#L51)

***

### hoveredAnnotations?

> `optional` **hoveredAnnotations**: `string`[]

List of annotation ID's that are hovered. Those will get the "hovered" style class.

#### Defined in

[types/Props.ts:23](https://github.com/GhentCDH/vue_component_annotated_text/blob/5675fc54077a4297a03f45161e62f99e3d8b3eba/src/types/Props.ts#L23)

***

### lines

> **lines**: [`Line`](../../AnnotatedText/interfaces/Line.md)[]

List of lines

#### Defined in

[types/Props.ts:27](https://github.com/GhentCDH/vue_component_annotated_text/blob/5675fc54077a4297a03f45161e62f99e3d8b3eba/src/types/Props.ts#L27)

***

### ~~render?~~

> `optional` **render**: [`RenderType`](../../AnnotatedText/type-aliases/RenderType.md)

#### Deprecated

#### Defined in

[types/Props.ts:47](https://github.com/GhentCDH/vue_component_annotated_text/blob/5675fc54077a4297a03f45161e62f99e3d8b3eba/src/types/Props.ts#L47)

***

### selectedAnnotations?

> `optional` **selectedAnnotations**: `string`[]

List of annotation ID's that are selected. Those will get the "active" style class

#### Defined in

[types/Props.ts:19](https://github.com/GhentCDH/vue_component_annotated_text/blob/5675fc54077a4297a03f45161e62f99e3d8b3eba/src/types/Props.ts#L19)

***

### showLabels?

> `optional` **showLabels**: `boolean`

Whether to show the labels

#### Defined in

[types/Props.ts:55](https://github.com/GhentCDH/vue_component_annotated_text/blob/5675fc54077a4297a03f45161e62f99e3d8b3eba/src/types/Props.ts#L55)

***

### style?

> `optional` **style**: [`AnnotationStyle`](../../AnnotatedText/interfaces/AnnotationStyle.md)

Object to define classes for styles.

#### Defined in

[types/Props.ts:63](https://github.com/GhentCDH/vue_component_annotated_text/blob/5675fc54077a4297a03f45161e62f99e3d8b3eba/src/types/Props.ts#L63)

***

### theme?

> `optional` **theme**: `string`

only default theme available for now

#### Defined in

[types/Props.ts:43](https://github.com/GhentCDH/vue_component_annotated_text/blob/5675fc54077a4297a03f45161e62f99e3d8b3eba/src/types/Props.ts#L43)

***

### verbose?

> `optional` **verbose**: `boolean`

Whether event messages are printed

#### Defined in

[types/Props.ts:39](https://github.com/GhentCDH/vue_component_annotated_text/blob/5675fc54077a4297a03f45161e62f99e3d8b3eba/src/types/Props.ts#L39)
