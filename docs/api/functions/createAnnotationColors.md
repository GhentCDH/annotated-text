[@ghentcdh/vue-component-annotated-text](../globals.md) / createAnnotationColors

# Function: createAnnotationColors()

> **createAnnotationColors**(`colors`, `config`?): `Record`\<`string`, [`AnnotationColor`](../interfaces/AnnotationColor.md)\>

Creates a set of annotation colors from a given set of color strings.

## Parameters

• **colors**: `Record`\<`string`, `string`\>

A record where the key is a string representing the annotation name and the value is a string representing the color.

• **config?**: `Config`

## Returns

`Record`\<`string`, [`AnnotationColor`](../interfaces/AnnotationColor.md)\>

A record where the key is a string representing the annotation name and the value is an `AnnotationColor` object.

## Defined in

[utils/createAnnotationColor.ts:81](https://github.com/GhentCDH/vue_component_annotated_text/blob/59a5cff35d6965ffe0b2afa94949652f590d3fbd/src/utils/createAnnotationColor.ts#L81)
