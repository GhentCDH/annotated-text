# Custom Annotation Weights

The annotated-text library supports custom weights for annotations to control their visual layering and rendering
priority. Annotations with higher weights are rendered on top of annotations with lower or null weights.

## How Weights Work

- **Higher weight values** render on top of lower weight values
- **`null` or undefined weights** are treated as the lowest priority (bottom layer)
- When annotations overlap, the weight determines which annotation appears visually dominant
- Weights can be any numeric value only positive

## Use Cases

Custom weights are particularly useful when:

- Multiple annotations overlap the same text range
- You need to prioritize certain annotation types (e.g., errors over suggestions)
- Creating hierarchical annotation layers (e.g., sentence-level above word-level)
- Ensuring important annotations remain visible when stacked

## Example

<div :id="id_default"></div>

<script setup>
//
import { onMounted } from "vue";
import { customWeights } from "@demo";
const id_default = `selection-custom-weights--default`;

onMounted(()=> {
    customWeights(id_default);
});
</script>
