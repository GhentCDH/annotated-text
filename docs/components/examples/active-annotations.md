# Highlight annotations

## Highlight

Annotations can be highlighted dynamically by hovering or clicking on them, but also through a function call on the
annotationText object.

With the `highlight` function you can highlight annotations by their ID, it will take the same colors as the hover with
mouse. When hovering over an annotation, it will override the highlighted state.

```typescript

const annotatedText = createAnnotatedText(id)
  .setText(text)
  .setAnnotations(textAnnotations);

annotatedText.highlight(['annotation-id-1', 'annotation-id-2']);
```

## Select

`selectAnnotations` works the same as `highlight`, but it will use the selected colors.

```typescript

const annotatedText = createAnnotatedText(id)
  .setText(text)
  .setAnnotations(textAnnotations);

annotatedText.selectAnnotations(['annotation-id-1', 'annotation-id-2']);
```

## Example

<div style="display: grid;  grid-template-columns: repeat(2, 1fr);">
    <h4>Default display renderer (highlight)</h4>
<h4>Underline display renderer</h4>
<div id="active-annotation--default"></div>
<div id="active-annotation--line"></div>
</div>

<script setup>
//
import { onMounted } from "vue";
import { ActiveAnnotations } from "@demo";
const id_default = `active-annotation--default`;
const id_line = `active-annotation--line`;

onMounted(()=> {
    ActiveAnnotations(id_default, id_line);

});
</script>
