# Display renderers

By default, annotations are displayed with a box around the annotated text.

But you can change the display renderer to use a different style, such as a underline or create a custom renderer.

## Example

<div style="display: grid;  grid-template-columns: repeat(2, 1fr);">
    <h4>Default display renderer</h4>
<h4>Line display renderer</h4>
<div id="create-edit-example--default"></div>
<div id="create-edit-example--line"></div>
</div>

<script setup>
//
import { onMounted } from "vue";
import { createAnnotatedText, TextLineAdapter, clearAnnotatedTextCache } from "@ghentcdh/vue-component-annotated-text";
import { greekText } from "@demo";
const id_default = `create-edit-example--default`;
const id_line = `create-edit-example--line`;

onMounted(()=> {
    clearAnnotatedTextCache()
    createAnnotatedText(id_default,
        {  
            text: TextLineAdapter(),
            annotation: {edit: true, create: true},
        })
    .setText(greekText.text)
    .setAnnotations(greekText.annotations);

 createAnnotatedText(id_line,
        {  
            text: TextLineAdapter(),
            annotation: {edit: true, create: true},
        })
    .setText(greekText.text)
    .setAnnotations(greekText.annotations);
});
</script>

