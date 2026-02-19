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

| Return Value            | Behavior                                        |
|-------------------------|-------------------------------------------------|
| `string`                | Looks up the named style from registered styles |
| `CustomAnnotationStyle` | Uses the returned style object directly         |
| `null`                  | Falls back to the default style                 |

```typescript
createAnnotatedText(containerId)
  .setStyleParams({
    styleFn: (annotation) => annotation.style,
  });
```

#### Predefined style functions

Helper functions are available to create `Partial<DefaultAnnotationStyle>` objects for each renderer type. Each takes a
color as its first argument and an optional style override object:

| Function               | Description                                                              |
|------------------------|--------------------------------------------------------------------------|
| `createHighlightStyle` | Sets `backgroundColor`, `borderColor`, and `tagBorderColor` to the color |
| `createUnderlineStyle` | Transparent background, sets `borderColor` and `tagBorderColor`          |
| `createGutterStyle`    | Transparent border, sets `backgroundColor` and `tagBorderColor`          |

```typescript
import { createHighlightStyle, createUnderlineStyle, createGutterStyle } from "@ghentcdh/annotated-text";

// Basic usage
createHighlightStyle("#ff3b3b");

// With overrides
createUnderlineStyle("#2196f3", { borderWidth: 3 });
```

### Default Style

The default style is used when `styleFn` returns `null` or when a named style is not found. If not configured, the
built-in default uses a red color (`#ff3b3b`).

You can set a custom default by passing a `defaultStyle` name that references a registered style:

```typescript
createAnnotatedText(containerId)
  .registerStyle("custom-default", {
    default: createHighlightStyle("#6b7280"),
  })
  .setStyleParams({
    styleFn: (annotation) => annotation.style ?? null,
    defaultStyle: "custom-default",
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
      default: createHighlightStyle(annotation.customColor),
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
4. If a `CustomAnnotationStyle` object is returned, it is used directly

## Registering Styles

### Single Style

```typescript
import { createAnnotatedText, createHighlightStyle } from "@ghentcdh/annotated-text";

createAnnotatedText(containerId)
  .registerStyle("style-red", {
    default: createHighlightStyle("#ff3b3b"),
  });
```

### Multiple Styles

```typescript
createAnnotatedText(containerId)
  .registerStyles({
    "style-green": {
      default: createHighlightStyle("#8bc34a"),
    },
    "style-blue": {
      default: createHighlightStyle("#4a70c3"),
    },
    "style-warning": {
      default: createHighlightStyle("#ff9800"),
    },
  });
```

### Chaining

All methods return the instance, so calls can be chained:

```typescript
createAnnotatedText(containerId)
  .registerStyle("style-red", {
    default: createHighlightStyle("#ff3b3b"),
  })
  .registerStyles({
    "style-green": { default: createHighlightStyle("#8bc34a") },
    "style-gutter": { default: createGutterStyle("#4a70c3") },
  })
  .setText(text)
  .setAnnotations(annotations);
```

## CustomAnnotationStyle

A `CustomAnnotationStyle` defines styles for each annotation state:

```typescript
type CustomAnnotationStyle = {
  default?: Partial<DefaultAnnotationStyle>;
  edit?: DefaultOverrideStyle;
  active?: DefaultOverrideStyle;
  hover?: DefaultOverrideStyle;
};
```

The `default` state accepts all `DefaultAnnotationStyle` properties. The `edit`, `active`, and `hover` states accept a
subset (`DefaultOverrideStyle`) limited to color-related properties.

### Default Style Properties

The `default` state supports the full set of style properties:

| Property               | Type     | Default     | Description                    |
|------------------------|----------|-------------|--------------------------------|
| `backgroundColor`      | `string` | `'#ff3b3b'` | Background fill color          |
| `backgroundOpacity`    | `number` | `0.3`       | Background fill opacity        |
| `borderColor`          | `string` | `'#ff3b3b'` | Border stroke color            |
| `borderOpacity`        | `number` | `0.6`       | Border stroke opacity          |
| `borderWidth`          | `number` | `2`         | Border stroke width            |
| `borderRadius`         | `number` | `6`         | Border corner radius           |
| `tagTextColor`         | `string` | `'#000000'` | Tag label text color           |
| `tagBackgroundColor`   | `string` | `'#ffffff'` | Tag label background color     |
| `tagBackgroundOpacity` | `number` | `0.1`       | Tag label background opacity   |
| `tagBorderColor`       | `string` | `'#ff3b3b'` | Tag label border color         |
| `tagBorderOpacity`     | `number` | `0.6`       | Tag label border opacity       |
| `tagBorderWidth`       | `number` | `1`         | Tag label border width         |
| `gutterGap`            | `number` | `6`         | Gap between gutter annotations |
| `gutterWidth`          | `number` | `3`         | Width of gutter annotations    |

### Override Style Properties (edit, active, hover)

The `edit`, `active`, and `hover` states can only override color-related properties:

| Property            | Type     |
|---------------------|----------|
| `backgroundColor`   | `string` |
| `backgroundOpacity` | `number` |
| `borderColor`       | `string` |
| `borderOpacity`     | `number` |
| `borderWidth`       | `number` |

Any property not specified in a state falls back to the `default` state, then to the built-in defaults.

### Built-in State Defaults

| State    | Default Overrides                                                                              |
|----------|------------------------------------------------------------------------------------------------|
| `hover`  | `borderWidth: 2`, `backgroundColor: '#cccccc'`, `borderColor: '#cccccc'`, `borderOpacity: 0.9` |
| `edit`   | `backgroundColor: '#ff3b3b'`, `borderColor: '#ff3b3b'`, `borderWidth: 2`                       |
| `active` | `backgroundOpacity: 0.8`, `borderWidth: 2`                                                     |

### Example

```typescript
createAnnotatedText(containerId)
  .registerStyle("error", {
    default: createHighlightStyle("#f44336"),
    hover: { backgroundColor: "#d32f2f", borderColor: "#d32f2f" },
    active: { backgroundOpacity: 0.7 },
  })
  .registerStyle("underline-blue", {
    default: createUnderlineStyle("#2196f3"),
    hover: { borderColor: "#1565c0" },
  });
```
