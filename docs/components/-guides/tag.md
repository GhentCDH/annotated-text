# Tags

For tags, you can configure the `tagConfig` property within the `annotation` configuration. This allows you to enable or
disable tags and define a custom function to determine the tag's content.

By default, tags are disabled. You can enable them by setting the `enabled` property to `true`. The `tagFn` function

```typescript
 createAnnotatedText(id, {
  annotation: {
    tagConfig: {
      enabled: true,
      tagFn: (annotation) => annotation.label ?? "No label",
    },
  },
});
```

Some additional properties you can configure include:

- `enabledOnHover`: A boolean that determines whether the tag is displayed only on hover (`true`) or always visible (
  `false`).
  The default is `false`.
- `padding`: A number that sets the padding around the tag. The default is `1`.
- `fontSize`: A number that sets the font size of the tag text. The default is `8`.

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

