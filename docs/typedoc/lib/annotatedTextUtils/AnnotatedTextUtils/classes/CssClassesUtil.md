[**@ghentcdh/vue-component-annotated-text**](../../../../README.md) • **Docs**

***

[@ghentcdh/vue-component-annotated-text](../../../../modules.md) / [lib/annotatedTextUtils/AnnotatedTextUtils](../README.md) / CssClassesUtil

# Class: CssClassesUtil

## Constructors

### new CssClassesUtil()

> **new CssClassesUtil**(`props`, `editingAnnotation`): [`CssClassesUtil`](CssClassesUtil.md)

#### Parameters

• **props**: [`AnnotatedTextProps`](../../../../types/Props/interfaces/AnnotatedTextProps.md)

• **editingAnnotation**: [`UpdateAnnotationState`](../../StateClasses/classes/UpdateAnnotationState.md)

#### Returns

[`CssClassesUtil`](CssClassesUtil.md)

#### Defined in

[lib/annotatedTextUtils/AnnotatedTextUtils.ts:28](https://github.com/GhentCDH/vue_component_annotated_text/blob/d7f662fc6e4815223b2966a3f98cd4c1fa9a5954/src/lib/annotatedTextUtils/AnnotatedTextUtils.ts#L28)

## Properties

### componentClasses

> **componentClasses**: `ComputedRef`\<`any`[]\>

#### Defined in

[lib/annotatedTextUtils/AnnotatedTextUtils.ts:36](https://github.com/GhentCDH/vue_component_annotated_text/blob/d7f662fc6e4815223b2966a3f98cd4c1fa9a5954/src/lib/annotatedTextUtils/AnnotatedTextUtils.ts#L36)

***

### editAnnotationState

> **editAnnotationState**: [`UpdateAnnotationState`](../../StateClasses/classes/UpdateAnnotationState.md)

#### Defined in

[lib/annotatedTextUtils/AnnotatedTextUtils.ts:26](https://github.com/GhentCDH/vue_component_annotated_text/blob/d7f662fc6e4815223b2966a3f98cd4c1fa9a5954/src/lib/annotatedTextUtils/AnnotatedTextUtils.ts#L26)

***

### props

> **props**: [`AnnotatedTextProps`](../../../../types/Props/interfaces/AnnotatedTextProps.md)

#### Defined in

[lib/annotatedTextUtils/AnnotatedTextUtils.ts:25](https://github.com/GhentCDH/vue_component_annotated_text/blob/d7f662fc6e4815223b2966a3f98cd4c1fa9a5954/src/lib/annotatedTextUtils/AnnotatedTextUtils.ts#L25)

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

[lib/annotatedTextUtils/AnnotatedTextUtils.ts:73](https://github.com/GhentCDH/vue_component_annotated_text/blob/d7f662fc6e4815223b2966a3f98cd4c1fa9a5954/src/lib/annotatedTextUtils/AnnotatedTextUtils.ts#L73)

***

### annotationGutterClasses()

> **annotationGutterClasses**(`annotation`, `line`): `string`[]

#### Parameters

• **annotation**: [`Annotation`](../../../../types/Annotation/interfaces/Annotation.md)

• **line**: [`AnnotatedLine`](../../../../types/AnnotatedText/interfaces/AnnotatedLine.md)

#### Returns

`string`[]

#### Defined in

[lib/annotatedTextUtils/AnnotatedTextUtils.ts:56](https://github.com/GhentCDH/vue_component_annotated_text/blob/d7f662fc6e4815223b2966a3f98cd4c1fa9a5954/src/lib/annotatedTextUtils/AnnotatedTextUtils.ts#L56)

***

### wordPartClasses()

> **wordPartClasses**(`wordPart`): `string`[]

#### Parameters

• **wordPart**: [`WordPart`](../../../../types/AnnotatedText/interfaces/WordPart.md)

#### Returns

`string`[]

#### Defined in

[lib/annotatedTextUtils/AnnotatedTextUtils.ts:49](https://github.com/GhentCDH/vue_component_annotated_text/blob/d7f662fc6e4815223b2966a3f98cd4c1fa9a5954/src/lib/annotatedTextUtils/AnnotatedTextUtils.ts#L49)
