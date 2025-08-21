# Show annotations details

<div style="display: grid;
  grid-template-columns: repeat(2, 1fr);">
    <div id="annotated_text"></div>
    <div id="annotated_text--details" style="display: flex; flex-direction: column; gap:8px"></div>
</div>

<script setup>
//
import { textWithChunks } from "@demo";

import { onMounted } from "vue";
import { clearAnnotatedTextCache} from "@ghentcdh/annotated_text";

onMounted(()=> {
    clearAnnotatedTextCache();
    textWithChunks('annotated_text', 'annotated_text--details')
});

</script>
