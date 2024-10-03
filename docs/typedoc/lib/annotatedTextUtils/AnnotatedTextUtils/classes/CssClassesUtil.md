[**@ghentcdh/vue-component-annotated-text**](../../../../README.md) • **Docs**

***

[@ghentcdh/vue-component-annotated-text](../../../../modules.md) / [lib/annotatedTextUtils/AnnotatedTextUtils](../README.md) / CssClassesUtil

# Class: CssClassesUtil\<P\>

## Type Parameters

• **P** *extends* [`CssClassUtilProps`](../type-aliases/CssClassUtilProps.md)

## Constructors

### new CssClassesUtil()

> **new CssClassesUtil**\<`P`\>(`props`, `editingAnnotation`): [`CssClassesUtil`](CssClassesUtil.md)\<`P`\>

#### Parameters

• **props**: `P`

• **editingAnnotation**: [`UpdateAnnotationState`](../../StateClasses/classes/UpdateAnnotationState.md)

#### Returns

[`CssClassesUtil`](CssClassesUtil.md)\<`P`\>

#### Defined in

[lib/annotatedTextUtils/AnnotatedTextUtils.ts:53](https://github.com/GhentCDH/vue_component_annotated_text/blob/6add7bb10a77b5452736ad4c56c99391d8dec5bd/src/lib/annotatedTextUtils/AnnotatedTextUtils.ts#L53)

## Properties

### componentClasses

> **componentClasses**: `ComputedRef`\<`any`[]\>

#### Defined in

[lib/annotatedTextUtils/AnnotatedTextUtils.ts:58](https://github.com/GhentCDH/vue_component_annotated_text/blob/6add7bb10a77b5452736ad4c56c99391d8dec5bd/src/lib/annotatedTextUtils/AnnotatedTextUtils.ts#L58)

***

### editAnnotationState

> **editAnnotationState**: [`UpdateAnnotationState`](../../StateClasses/classes/UpdateAnnotationState.md)

#### Defined in

[lib/annotatedTextUtils/AnnotatedTextUtils.ts:51](https://github.com/GhentCDH/vue_component_annotated_text/blob/6add7bb10a77b5452736ad4c56c99391d8dec5bd/src/lib/annotatedTextUtils/AnnotatedTextUtils.ts#L51)

***

### props

> **props**: `P`

#### Defined in

[lib/annotatedTextUtils/AnnotatedTextUtils.ts:50](https://github.com/GhentCDH/vue_component_annotated_text/blob/6add7bb10a77b5452736ad4c56c99391d8dec5bd/src/lib/annotatedTextUtils/AnnotatedTextUtils.ts#L50)

## Methods

### annotationClasses()

> **annotationClasses**(`annotation`, `start`, `end`, `allowCreate`): `string`[]

#### Parameters

• **annotation**: [`Annotation`](../../../../types/Annotation/interfaces/Annotation.md)

• **start**: `number`

• **end**: `number`

• **allowCreate**: `boolean`

#### Returns

`string`[]

#### Defined in

[lib/annotatedTextUtils/AnnotatedTextUtils.ts:96](https://github.com/GhentCDH/vue_component_annotated_text/blob/6add7bb10a77b5452736ad4c56c99391d8dec5bd/src/lib/annotatedTextUtils/AnnotatedTextUtils.ts#L96)

***

### annotationGutterClasses()

> **annotationGutterClasses**(`annotation`, `line`): `string`[]

#### Parameters

• **annotation**: [`Annotation`](../../../../types/Annotation/interfaces/Annotation.md)

• **line**: [`AnnotatedLine`](../../../../types/AnnotatedText/interfaces/AnnotatedLine.md)

#### Returns

`string`[]

#### Defined in

[lib/annotatedTextUtils/AnnotatedTextUtils.ts:78](https://github.com/GhentCDH/vue_component_annotated_text/blob/6add7bb10a77b5452736ad4c56c99391d8dec5bd/src/lib/annotatedTextUtils/AnnotatedTextUtils.ts#L78)

***

### wordPartClasses()

> **wordPartClasses**(`wordPart`): `string`[]

#### Parameters

• **wordPart**: [`WordPart`](../../../../types/AnnotatedText/interfaces/WordPart.md)

#### Returns

`string`[]

#### Defined in

[lib/annotatedTextUtils/AnnotatedTextUtils.ts:71](https://github.com/GhentCDH/vue_component_annotated_text/blob/6add7bb10a77b5452736ad4c56c99391d8dec5bd/src/lib/annotatedTextUtils/AnnotatedTextUtils.ts#L71)
