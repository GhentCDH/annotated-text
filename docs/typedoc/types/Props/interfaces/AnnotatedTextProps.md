[**@ghentcdh/vue-component-annotated-text**](../../../README.md) • **Docs**

***

[@ghentcdh/vue-component-annotated-text](../../../modules.md) / [types/Props](../README.md) / AnnotatedTextProps

# Interface: AnnotatedTextProps

## Properties

### allowCreate?

> `optional` **allowCreate**: `boolean`

Whether to allow creating new annotations

#### Defined in

types/Props.ts:75

***

### allowEdit?

> `optional` **allowEdit**: `boolean`

Whether to allow editing annotations

#### Defined in

types/Props.ts:71

***

### ~~annotationOffset?~~

> `optional` **annotationOffset**: `number`

#### Deprecated

#### Defined in

types/Props.ts:39

***

### annotations?

> `optional` **annotations**: [`Annotation`](../../Annotation/interfaces/Annotation.md)[]

List of annotations to be displayed

#### Defined in

types/Props.ts:23

***

### autoAnnotationWeights?

> `optional` **autoAnnotationWeights**: `boolean`

Whether to automatically calculate weights

#### Defined in

types/Props.ts:63

***

### componentId

> **componentId**: `string`

Required unique ID of the component

#### Defined in

types/Props.ts:15

***

### debug?

> `optional` **debug**: `boolean`

Whether verbose debug messages are printed

#### Defined in

types/Props.ts:43

***

### display?

> `optional` **display**: [`AnnotationTarget`](../../Annotation/type-aliases/AnnotationTarget.md)

Whether to display span or gutter annotations

#### Defined in

types/Props.ts:55

***

### hoveredAnnotations?

> `optional` **hoveredAnnotations**: `string`[]

List of annotation ID's that are hovered. Those will get the "hovered" style class.

#### Defined in

types/Props.ts:31

***

### lines

> **lines**: [`Line`](../../AnnotatedText/interfaces/Line.md)[]

List of lines

#### Defined in

types/Props.ts:35

***

### listenToOnCreateStart?

> `optional` **listenToOnCreateStart**: `boolean`

Whether you are listening to the onCreateStart emit or not. If false default behaviour will be used.

#### Defined in

types/Props.ts:91

***

### listenToOnCreating?

> `optional` **listenToOnCreating**: `boolean`

Whether you are listening to the onCreating emit or not. If false default behaviour will be used.

#### Defined in

types/Props.ts:95

***

### listenToOnKeyPressed?

> `optional` **listenToOnKeyPressed**: `boolean`

Whether you are listening to the onKeyPressed emit or not. If false default behaviour will be used.

#### Defined in

types/Props.ts:87

***

### listenToOnUpdateStart?

> `optional` **listenToOnUpdateStart**: `boolean`

Whether you are listening to the onUpdateStart emit or not. If false default behaviour will be used.

#### Defined in

types/Props.ts:79

***

### listenToOnUpdating?

> `optional` **listenToOnUpdating**: `boolean`

Whether you are listening to the onUpdating emit or not. If false default behaviour will be used.

#### Defined in

types/Props.ts:83

***

### ~~render?~~

> `optional` **render**: [`RenderType`](../../AnnotatedText/type-aliases/RenderType.md)

#### Deprecated

#### Defined in

types/Props.ts:51

***

### selectedAnnotations?

> `optional` **selectedAnnotations**: `string`[]

List of annotation ID's that are selected. Those will get the "active" style class

#### Defined in

types/Props.ts:27

***

### showLabels?

> `optional` **showLabels**: `boolean`

Whether to show the labels

#### Defined in

types/Props.ts:59

***

### style?

> `optional` **style**: [`AnnotationStyle`](../../AnnotatedText/interfaces/AnnotationStyle.md)

Object to define classes for styles.

#### Defined in

types/Props.ts:67

***

### text?

> `optional` **text**: `string`

Full text

#### Defined in

types/Props.ts:19

***

### theme?

> `optional` **theme**: `string`

only default theme available for now

#### Defined in

types/Props.ts:47
