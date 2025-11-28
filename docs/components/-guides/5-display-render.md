# Annotation Rendering

The annotated-text library supports different render types for annotations, allowing you to visually distinguish
annotations using highlights, underlines, gutter markers, and custom renderers.

## Overview

Annotation rendering lets you:

- Apply different visual styles to annotations (highlight, underline, gutter)
- Dynamically assign render types using a `renderFn`
- Use built-in renderers or create custom ones
- Register single renderers or multiple renderers at once
- By default following renderers are available:
    - **highlight**: Default renderer that highlights text
    - **underline**: Underlines the annotated text
    - **gutter**: Displays annotation markers in the gutter/margin

### Example with default renderers

<div :id="id_simple"></div>

<script setup>
//
</script>

## Configuration

### Render Function

The `renderFn` configuration option determines which renderer to use for each annotation. It receives an annotation and
returns a string that corresponds to a registered renderer.

```typescript
createAnnotatedText(containerId, {
  annotation: {
    render: {
      renderFn: (annotation) => annotation.target,
    },
  },
});
```

The function can implement any logic to determine the render type:

```typescript
renderFn: (annotation) => {
  if (annotation.type === 'entity') return 'highlight';
  if (annotation.type === 'relation') return 'underline';
  return 'gutter';
}
```

## Built-in Renderers

The library provides three built-in renderers:

| Renderer                    | Render Key  | Description                                         |
|-----------------------------|-------------|-----------------------------------------------------|
| `HighlightAnnotationRender` | `highlight` | Renders a background highlight behind the text      |
| `UnderLineAnnotationRender` | `underline` | Renders a line beneath the text                     |
| `GutterAnnotationRender`    | `gutter`    | Renders a marker in the gutter area beside the text |

### Importing Built-in Renderers

```typescript
import {
  HighlightAnnotationRender,
  UnderLineAnnotationRender,
  GutterAnnotationRender,
} from "@ghentcdh/annotated-text";
```

## Registering Renderers

### Single Renderer Registration

Use `registerRender` to register a single renderer:

```typescript
import { createAnnotatedText, HighlightAnnotationRender } from "@ghentcdh/annotated-text";

createAnnotatedText(containerId, config)
  .registerRender(new HighlightAnnotationRender());
```

### Multiple Renderer Registration

Use `registerRenders` to register multiple renderers at once:

```typescript
import {
  createAnnotatedText,
  GutterAnnotationRender,
  UnderLineAnnotationRender,
} from "@ghentcdh/annotated-text";

createAnnotatedText(containerId, config)
  .registerRenders(
    new GutterAnnotationRender(),
    new UnderLineAnnotationRender(),
  );
```

### Chaining Registrations

Both methods return the annotated text instance, allowing you to chain calls:

```typescript
createAnnotatedText(containerId, config)
  .registerRender(new HighlightAnnotationRender())
  .registerRenders(
    new GutterAnnotationRender(),
    new UnderLineAnnotationRender(),
  )
  .setText(text)
  .setAnnotations(annotations);
```

### Full Example with defaults

<div style="display: grid;  grid-template-columns: repeat(2, 1fr);">
    <h4>Default display renderer (highlight)</h4>
<h4>Underline display renderer</h4>
<div :id="id_default"></div>
<div :id="id_line"></div>
<div id="create-edit-example--default"></div>
<div id="create-edit-example--line"></div>
</div>

<script setup>
//
import { onMounted } from "vue";
import { RenderUnderline, annotationRender } from "@demo";
const id_default = `display-render--default`;
const id_line = `display-render--line`;

onMounted(()=> {
    RenderUnderline(id_default,id_line);

});


const id_simple = `selection-annotation-render--default`;

onMounted(()=> {
    annotationRender(id_simple);
});
</script>
