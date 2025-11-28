# Annotation render custom styles

## Example

<div :id="id_default"></div>

<script setup>
//
import { onMounted } from "vue";
import { customStyles } from "@demo";
const id_default = `selection-custom-styles--default`;

onMounted(()=> {
    customStyles(id_default);
});
</script>
