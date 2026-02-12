# Annotation Styles

The annotated-text library lets you define reusable style presets and dynamically assign them to annotations.

## Overview

- Define named style presets with specific colors
- Dynamically assign styles per annotation using a `styleFn`
- Return a style name, an inline style object, or `null` to fall back to the default
- Register single or multiple styles at once

## Configuration

### Style Function

The `styleFn` determines which style to apply to each annotation. It receives an annotation and can return:

| Return Value      | Behavior                                        |
|-------------------|-------------------------------------------------|
| `string`          | Looks up the named style from registered styles |
| `AnnotationStyle` | Uses the returned style object directly         |
| `null`            | Falls back to the default style                 |

```typescript
createAnnotatedText(containerId)
  .setStyleParams({
    styleFn: (annotation) => annotation.style,
  });
```

### Default Style

The default style is used when `styleFn` returns `null` or when a named style is not found. If not configured, the
built-in default uses a red color (`#ff3b3b`).

```typescript
createAnnotatedText(containerId)
  .setStyleParams({
    styleFn: (annotation) => annotation.style ?? null,
    defaultStyle: {
      color: createAnnotationColor("#6b7280"),
    },
  });
```

### Example

<div :id="id_default"></div>

<script setup>
//
import { onMounted } from "vue";
import { customStyles } from "@demo";
const id_default = `selection-custom-styles--default`;

onMounted(()=> {
    customStyles(id_default);
});
</script>

### Return Type Examples

**Returning a style name (string):**

```typescript
styleFn: (annotation) => {
  if (annotation.type === 'error') return 'style-error';
  if (annotation.type === 'warning') return 'style-warning';
  return 'style-default';
}
```

**Returning an inline style object:**

```typescript
styleFn: (annotation) => {
  if (annotation.customColor) {
    return {
      color: createAnnotationColor(annotation.customColor),
    };
  }
  return null; // Fall back to default
}
```

**Returning null for default styling:**

```typescript
styleFn: (annotation) => {
  if (annotation.highlighted) return 'style-highlight';
  return null; // Uses defaultStyle
}
```

## Style Resolution

When rendering an annotation, the style is resolved in the following order:

1. `styleFn` is called with the annotation
2. If `null` is returned, the `defaultStyle` is used
3. If a `string` is returned, the named style is looked up from registered styles
    - If found, that style is used
    - If not found, the `defaultStyle` is used (with a warning)
4. If an `AnnotationStyle` object is returned, it is used directly

## Registering Styles

### Single Style

```typescript
import { createAnnotatedText, createAnnotationColor } from "@ghentcdh/annotated-text";

createAnnotatedText(containerId)
  .registerStyle("style-red", {
    color: createAnnotationColor("#ff3b3b"),
  });
```

### Multiple Styles

```typescript
createAnnotatedText(containerId)
  .registerStyles({
    "style-green": {
      color: createAnnotationColor("#8bc34a"),
    },
    "style-blue": {
      color: createAnnotationColor("#4a70c3"),
    },
    "style-warning": {
      color: createAnnotationColor("#ff9800"),
    },
  });
```

### Chaining

All methods return the instance, so calls can be chained:

```typescript
createAnnotatedText(containerId)
  .registerStyle("style-red", {
    color: createAnnotationColor("#ff3b3b"),
  })
  .registerStyles({
    "style-green": { color: createAnnotationColor("#8bc34a") },
    "style-gutter": { color: createAnnotationColor("#4a70c3") },
  })
  .setText(text)
  .setAnnotations(annotations);
```

## Complete Example

```typescript
import {
  clearAnnotatedTextCache,
  createAnnotatedText,
  createAnnotationColor,
} from "@ghentcdh/annotated-text";

interface MyAnnotation {
  start: number;
  end: number;
  target: string;
  style: string;
  id: string;
}

const annotations: MyAnnotation[] = [
  { start: 0, end: 200, target: "gutter", style: "style-gutter", id: "p1" },
  { start: 65, end: 68, target: "underline", style: "style-red", id: "red" },
  { start: 109, end: 114, target: "highlight", style: "style-green", id: "green" },
];

const text = `This is an example text with custom styles.
The first line has a red annotation color.
The second line has a green annotation color.`;

clearAnnotatedTextCache();

createAnnotatedText("container")
  .setRenderParams({
    renderFn: (annotation) => annotation.target,
  })
  .setStyleParams({
    styleFn: (annotation) => annotation.style,
    defaultStyle: {
      color: createAnnotationColor("#9ca3af"),
    },
  })
  .setTagLabelFn((a) => a.id)
  .registerStyle("style-red", {
    color: createAnnotationColor("#ff3b3b"),
  })
  .registerStyles({
    "style-green": { color: createAnnotationColor("#8bc34a") },
    "style-gutter": { color: createAnnotationColor("#4a70c3") },
  })
  .setText(text)
  .setAnnotations(annotations);
```
