# Annotation styles

The annotated-text library supports styling for annotations, allowing you to define reusable style presets that can be
applied dynamically based on annotation properties.

## Overview

Custom styles let you:

- Define named style presets with specific colors
- Dynamically assign styles to annotations using a `styleFn`
- Return style names, inline style objects, or fall back to defaults
- Register single styles or multiple styles at once
- Separate styling concerns from annotation data

## Configuration

### Style Function

The `styleFn` configuration option determines which style to apply to each annotation. It receives an annotation and can
return:

| Return Value      | Behavior                                        |
|-------------------|-------------------------------------------------|
| `string`          | Looks up the named style from registered styles |
| `AnnotationStyle` | Uses the returned style object directly         |
| `null`            | Falls back to the default style                 |

```typescript
createAnnotatedText(containerId, {
  annotation: {
    style: {
      styleFn: (annotation) => annotation.style,
    },
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

### Default Style

You can customize the default style that is used when `styleFn` returns `null` or when a named style is not found:

```typescript
createAnnotatedText(containerId, {
  annotation: {
    style: {
      styleFn: (annotation) => annotation.style ?? null,
      defaultStyle: {
        color: createAnnotationColor("#6b7280"),
      },
    },
  },
});
```

If no `defaultStyle` is provided, the library uses a built-in default with a red color (`#ff3b3b`).

## Style Resolution

When rendering an annotation, the style is resolved in the following order:

1. The `styleFn` is called with the annotation
2. If `null` is returned → the `defaultStyle` is used
3. If a `string` is returned → the named style is looked up from registered styles
    - If the named style exists → it is used
    - If not found → the `defaultStyle` is used (with a warning)
4. If an `AnnotationStyle` object is returned → it is used directly

## Registering Styles

### Single Style Registration

Use `registerStyle` to register a single named style:

```typescript
import { createAnnotatedText, createAnnotationColor } from "@ghentcdh/annotated-text";

createAnnotatedText(containerId, config)
  .registerStyle("style-red", {
    color: createAnnotationColor("#ff3b3b"),
  });
```

### Bulk Style Registration

Use `registerStyles` to register multiple styles at once:

```typescript
createAnnotatedText(containerId, config)
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

### Chaining Registrations

Both methods return the annotated text instance, allowing you to chain calls:

```typescript
createAnnotatedText(containerId, config)
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

createAnnotatedText("container", {
  annotation: {
    render: {
      renderFn: (annotation) => annotation.target,
    },
    style: {
      styleFn: (annotation) => annotation.style,
      defaultStyle: {
        color: createAnnotationColor("#9ca3af"),
      },
    },
    tagConfig: {
      enabled: true,
      tagFn: (a) => a.id,
    },
  },
})
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

## API Reference

[AnnotationStyleParams](annotated-text/api/type-aliases/AnnotationStyleParams.html)
