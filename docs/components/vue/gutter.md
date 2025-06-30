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
import {  greekText } from "@demo";

</script>

## Gutter example

<div style="display: grid;  grid-template-columns: repeat(2, 1fr);"> 

<ClientOnly>
<div>
<h3>V1</h3>

<AnnotatedText
key="text"
:component-id="'1'"
:annotations="greekText.annotationsWithGutters"
:text="greekText.text"
/>
</div>
<div>
<h3>V2</h3>

<AnnotatedTextV2
key="text"
:component-id="'1'"
:annotations="greekText.annotationsWithGutters"
:lines="greekText.lines"
/>
</div>
</ClientOnly>
</div>
