# Annotation render weight orders

If you use different annotation renderers, you might want to control the order in which they are rendered.

The default render weight orders are:

- highlight: 1
- underline: 2

If you create a custom renderer, you can customize the weight order by setting the `weightOrder` property in the
renderer definition.

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
