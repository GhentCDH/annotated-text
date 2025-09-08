# Tags

Tags only work for now on underlined annotations.

```typescript

```

## Example

<div>
<div :id="id_line"></div>
</div>

<script setup>
//
import { onMounted } from "vue";
import { RenderTag } from "@demo";
const id_line = `render-tag--line`;

onMounted(()=> {
    RenderTag(id_line);
});
</script>

