---
AnnotatedText
---

# Gutter example

<script setup>
import {
  AnnotatedText,
  Debugger,
  UserActionState,
} from "@ghentcdh/vue-component-annotated-text";
import { lines, annotationsWithGutters } from "@demo";

</script>

## Gutter example
<ClientOnly>
<AnnotatedText
    key="text"
    :component-id="'1'" 
    :annotations="annotationsWithGutters"
    :lines="lines"
/>
</ClientOnly>
