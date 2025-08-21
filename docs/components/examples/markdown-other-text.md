# Markdown

Some other markdown examples

# Selection

## selection from annotated text, starting at the beginning.

<div id="annotated_text--markdown_1"></div>

## selection from annotated text, starting somewhere in the middle.

<div id="annotated_text--markdown_2"></div>

<script setup>
//
import { markdown_1 } from "@demo";

import { onMounted } from "vue";
import { clearAnnotatedTextCache} from "@ghentcdh/annotated_text";

onMounted(()=> {
    clearAnnotatedTextCache();
    markdown_1('annotated_text--markdown_1', { start: 0, end: 423 },)
    markdown_1('annotated_text--markdown_2', { start: 412, end: 600 },)
});
</script>
