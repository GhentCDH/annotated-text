# Word Snapper

Word snapper is a snapper functionality that allows you to limit the annotation selection to a single word. This is
useful when you want to ensure that the user can only select whole words, preventing partial selections.

```ts

``` 

# Example

<div>
    <div id="annotated--word-snapper"></div>
</div>

<script setup>
//
import { onMounted } from "vue";

import { clearAnnotatedTextCache} from "@ghentcdh/annotated_text";
import { wordSnapper } from "@demo";

onMounted(()=> {
    clearAnnotatedTextCache();
    wordSnapper('annotated--word-snapper')
});

</script>
