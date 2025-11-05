# Interaction between components

If you edit on the right side, the left side will update automatically. and vice versa.

<div :id="id"></div>


<script setup>
//
import { interActionBetweenComponents } from "@demo";
import { onMounted } from "vue";
import { createAnnotatedText, clearAnnotatedTextCache} from "@ghentcdh/annotated-text";

const id = `annotated-text--interaction`;
onMounted(()=> {
    clearAnnotatedTextCache();
    interActionBetweenComponents(id)
});
</script>
