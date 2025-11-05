# Different Annotation Renderers

This example demonstrates how to use different annotation renderers for active annotations in a text annotation tool.
The
default renderer highlights the selected text, while the underline renderer adds an underline to the selected text.

```typescript
createAnnotatedText(id, {
  annotation: {
    defaultRender: "underline", // or highlight
  },
})
```

Examples used:

- 1 character selection with default highlight renderer
- 1 character selection with underline renderer
- 3 character selection with default highlight renderer
- 3 character selection with underline renderer
- Emoiji selection with default highlight renderer
- Emoiji selection with underline renderer

To play with the example, all edit and create functionalities are enabled. You can create new annotations by selecting
text and dragging to adjust the selection.

## Example

<div style="display: grid;  grid-template-columns: repeat(2, 1fr);">
    <h4>Default display renderer (highlight)</h4>
<h4>Underline display renderer</h4>
<div :id="id_default"></div>
<div :id="id_line"></div>
</div>

<script setup>
//
import { onMounted } from "vue";
import { createDifferentAnnotationRenders } from "@demo";
const id_default = `selection-renderer-annotation--default`;
const id_line = `selection-renderer-annotation--line`;

onMounted(()=> {
    createDifferentAnnotationRenders(id_default, id_line);

});
</script>
