# Custom Annotation Rendering

The annotated-text library allows you to customize how individual annotations are displayed by providing a custom render
function. This gives you full control over the visual presentation of different annotation types.

### Basic Usage

To customize annotation rendering, pass a `renderFn` to the `annotation` configuration option:

```typescript
import { AnnotationRenderFn } from "@ghentcdh/annotated-text";

const customRenderFn: AnnotationRenderFn = (annotation: Annotation) => {
  switch (annotation.id) {
    case "1":
      return UnderLineAnnotationRender;
    case "3":
      return GutterAnnotationRender;
    default:
      return TextAnnotationRender;
  }
};

createAnnotatedText(id_default, {
  annotation: {
    renderFn: customRenderFn,
  },
});
```

### How It Works

The `renderFn` is called for each annotation and receives the annotation object as its parameter. Based on the
annotation's properties (like `id`, `type`, or custom metadata), you can return different render components to control
how that annotation appears.

### Available Render Components

The library provides several built-in render components:

- **`TextAnnotationRender`** - Default inline text rendering
- **`UnderLineAnnotationRender`** - Underlined text style
- **`GutterAnnotationRender`** - Displays annotation in the gutter/margin

### Custom Logic

You can use any annotation property to determine the render component:

```typescript
import { AnnotationRenderFn } from "@ghentcdh/annotated-text";

const customRenderFn: AnnotationRenderFn = (annotation: Annotation) => {
  // Based on annotation type
  if (annotation.type === "comment") {
    return GutterAnnotationRender;
  }

  // Based on custom metadata
  if (annotation.metadata?.importance === "high") {
    return UnderLineAnnotationRender;
  }

  return TextAnnotationRender;
};
```

## Example

<div style="display: grid;  grid-template-columns: repeat(2, 1fr);">
    <h4>Default display renderer (highlight)</h4>
<h4></h4>
<div :id="id_default"></div>
</div>

<script setup>
//
import { onMounted } from "vue";
import { customAnnotationRender } from "@demo";
const id_default = `selection-custom-annotation--default`;

onMounted(()=> {
    customAnnotationRender(id_default);
});
</script>
