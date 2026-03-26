# Markdown example

<div :id="markdownId">
</div>

<script setup>
//
import { createMarkdownExample,} from "@demo";

import { onMounted } from "vue";
import { clearAnnotatedTextCache } from "@ghentcdh/annotated-text";

const markdownId = 'full-markdown-example';

onMounted(()=> {
    clearAnnotatedTextCache();
    createMarkdownExample(markdownId);
});
</script>

