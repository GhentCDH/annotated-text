# Annotation Rendering

The annotated-text library supports different render types for annotations, allowing you to visually distinguish
annotations using highlights, underlines, gutter markers, and custom renderers.

## Overview

Annotation rendering lets you:

- Apply different visual styles to annotations (highlight, underline, gutter)
- Dynamically assign render types per annotation using a `renderFn`
- Use built-in renderers or create custom ones
- Register single or multiple renderers at once

Three built-in renderers are registered by default:

| Renderer      | Key         | Description                                    |
|---------------|-------------|------------------------------------------------|
| `HighlightAnnotationRender` | `highlight` | Background highlight behind the text |
| `UnderLineAnnotationRender` | `underline` | Line beneath the text                |
| `GutterAnnotationRender`    | `gutter`    | Marker in the gutter area            |

### Example with default renderers

<div :id="id_simple"></div>

<script setup>
//
</script>

## Configuration

### Default Renderer

When no `renderFn` is provided, or when `renderFn` returns `null` or a key that does not match any registered renderer,
the default renderer is used. By default this is `highlight`. Override it with `setRenderParams`:

```typescript
createAnnotatedText(containerId)
  .setRenderParams({
    defaultRenderer: 'underline'
  })
```

### Render Function

Use `renderFn` to choose a renderer per annotation. It receives the annotation and should return a registered renderer
key, or `null` to fall back to the default:

```typescript
createAnnotatedText(containerId)
  .setRenderParams({
    renderFn: (annotation) => annotation.target
  })
```

The function can contain any logic:

```typescript
createAnnotatedText(containerId)
  .setRenderParams({
    renderFn: (annotation) => {
      if (annotation.type === 'entity') return 'highlight';
      if (annotation.type === 'relation') return 'underline';
      return 'gutter';
    }
  })
```

## Registering Renderers

### Single Renderer

```typescript
import { createAnnotatedText, HighlightAnnotationRender } from "@ghentcdh/annotated-text";

createAnnotatedText(containerId)
  .registerRender(new HighlightAnnotationRender());
```

### Multiple Renderers

```typescript
import {
  createAnnotatedText,
  GutterAnnotationRender,
  UnderLineAnnotationRender,
} from "@ghentcdh/annotated-text";

createAnnotatedText(containerId)
  .registerRenders(
    new GutterAnnotationRender(),
    new UnderLineAnnotationRender(),
  );
```

### Chaining

All methods return the instance, so calls can be chained:

```typescript
createAnnotatedText(containerId)
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
