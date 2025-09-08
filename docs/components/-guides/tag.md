# Tags

Tags only work for now on underlined annotations.

```typescript

```

## Example

<div style="display: grid;  grid-template-columns: repeat(2, 1fr);">
    <h4>Display tag</h4>
    <h4>Display tag on hover</h4>
    <div :id="id_line"></div>
    <div :id="id_hover"></div>
</div>

<script setup>
//
import { onMounted } from "vue";
import { RenderTag } from "@demo";
const id_line = `render-tag--line`;
const id_hover = `render-tag--hover`;

onMounted(()=> {
    RenderTag(id_line);
    RenderTag(id_hover, true);
});
</script>

