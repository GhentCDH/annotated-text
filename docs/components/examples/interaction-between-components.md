# Interaction between components

If you edit on the right side, the left side will update automatically. and vice versa.

<div id="annotated-text--interaction"></div>

<script setup>
//
import { interActionBetweenComponents } from "@demo";
import { onMounted } from "vue";
import { createAnnotatedText, clearAnnotatedTextCache} from "@ghentcdh/vue-component-annotated-text";


onMounted(()=> {
    clearAnnotatedTextCache();
    interActionBetweenComponents('annotated-text--interaction')
});
</script>
