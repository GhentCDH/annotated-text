# Custom Annotation Rendering

> TODO implement example

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
