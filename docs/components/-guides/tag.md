# Tags

## Renderer Responsibility

Tag visibility is controlled at the annotation renderer level. Each renderer is responsible for determining whether to
display tags for its annotations.

## Tag Label Function

To display tags, you must set a tag label function using `.setTagLabelFn()`:

```typescript
createAnnotatedText(id)
  .setTagLabelFn((annotation) => annotation.label ?? 'No label')
```

**Behavior:**

- If no `.setTagLabelFn()` is configured, no tags will be displayed
- The function receives an annotation and must return:
    - A **string** to display that text as the tag label
    - `null` or `undefined` to hide the tag for that annotation

## Examples

```typescript
   // Show annotation label or fallback text
   .setTagLabelFn((annotation) => annotation.label ?? 'No label')

  // Show only annotations with labels
  .setTagLabelFn((annotation) => annotation.label ?? null)

  // Conditional display
  .setTagLabelFn((annotation) =>
    annotation.confidence > 0.8 ? annotation.label : null
  )
```

## Future Enhancement

In a later phase, custom tag rendering will be supported, allowing you to provide your own rendering logic for tag
display.

## Example

<div>
<label>
  <input type="radio" name="tagConfig" value="highlight" v-model="defaultRender"/>Render highlight
</label>
<label>
  <input type="radio" name="tagConfig" value="underline" v-model="defaultRender"/>Render underline
</label>
</div>
<div style="display: grid;  grid-template-columns: repeat(2, 1fr);">
    <h4>Display tag</h4>
    <h4>Display tag on hover</h4>
    <div :id="id_line"></div>
    <div :id="id_hover"></div>
</div>

<script setup>
//
import { onMounted, ref, watch } from "vue";
import { RenderTag } from "@demo";

const id_line = `render-tag--line`;
const id_hover = `render-tag--hover`;
const defaultRender = ref('underline');

onMounted(()=> {
    RenderTag(id_line, false, defaultRender.value);
    RenderTag(id_hover, true, defaultRender.value);
});

watch(defaultRender, (newVal) => {
    console.log("model changed:", newVal);
    RenderTag(id_line, false, newVal);
    RenderTag(id_hover, true, newVal);
});
</script>

