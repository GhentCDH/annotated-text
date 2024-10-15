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

[utils/createAnnotationColor.ts:78](https://github.com/GhentCDH/vue_component_annotated_text/blob/f198f4099aac4fb2c5d74cb86dba0c84c00d1230/src/utils/createAnnotationColor.ts#L78)
