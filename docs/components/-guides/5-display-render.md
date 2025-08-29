# Display renderers

By default, annotations are displayed with a box around the annotated text.

But you can change the display renderer to use a different style, such as a underline or create a custom renderer.

## Example

<div style="display: grid;  grid-template-columns: repeat(2, 1fr);">
    <h4>Default display renderer (highlight)</h4>
<h4>Underline display renderer</h4>
<div id="create-edit-example--default"></div>
<div id="create-edit-example--line"></div>
</div>

<script setup>
//
import { onMounted } from "vue";
import { RenderUnderline } from "@demo";
const id_default = `create-edit-example--default`;
const id_line = `create-edit-example--line`;

onMounted(()=> {
    RenderUnderline(id_default,id_line);
});
</script>

