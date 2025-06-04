---
AnnotatedText
---

# Gutter example

<script setup>
//
import {
  AnnotatedText, 
  AnnotatedTextV2,
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

## v2

:::warning
Fix gutter weights
:::

<AnnotatedTextV2
key="text"
:component-id="'1'"
:annotations="annotationsWithGutters"
:textLines="lines"
/>
</ClientOnly>
