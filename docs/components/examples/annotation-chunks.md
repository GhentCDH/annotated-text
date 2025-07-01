# Show annotations details

<ClientOnly>
<div style="display: grid;
  grid-template-columns: repeat(2, 1fr);">
    <div id="annotated-text"></div>
    <div id="annotated-text--details" style="display: flex; flex-direction: column; gap:8px"></div>
</div>

<script setup>
//
import { textWithChunks } from "@demo";

textWithChunks('annotated-text', 'annotated-text--details')

</script>
</ClientOnly>
