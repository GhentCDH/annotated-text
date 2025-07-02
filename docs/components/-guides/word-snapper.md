# Word Snapper

Word snapper is a snapper functionality that allows you to limit the annotation selection to a single word. This is
useful when you want to ensure that the user can only select whole words, preventing partial selections.

```ts

``` 

# Example

<ClientOnly>
<div>
    <div id="annotated--word-snapper"></div>
</div>

<script setup>
//
import { wordSnapper } from "@demo";

wordSnapper('annotated--word-snapper')

</script>
</ClientOnly>
