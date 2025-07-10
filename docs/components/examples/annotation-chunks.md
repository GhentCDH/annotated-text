# Show annotations details

<div style="display: grid;
  grid-template-columns: repeat(2, 1fr);">
    <div id="annotated-text"></div>
    <div id="annotated-text--details" style="display: flex; flex-direction: column; gap:8px"></div>
</div>

<script setup>
//
import { textWithChunks } from "@demo";

import { onMounted } from "vue";
import { clearAnnotatedTextCache} from "@ghentcdh/vue-component-annotated-text";

onMounted(()=> {
    clearAnnotatedTextCache();
    textWithChunks('annotated-text', 'annotated-text--details')
});

</script>
