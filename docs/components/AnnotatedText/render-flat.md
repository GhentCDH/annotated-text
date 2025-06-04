---
AnnotatedText
---

# Render flat

The component can be rendered flat when the property `renderNested` is set to `false`. This will render the annotations
in a flat manner, without nesting them.


<script setup>
//
import {
  AnnotatedText,
  Debugger,
  UserActionState,
} from "@ghentcdh/vue-component-annotated-text";
import { lines, annotations } from "@demo";



const annot = annotations;
const textLines = lines;
</script>


<AnnotatedText
:annotations="annot"
:lines="textLines"
:render="'flat'"
/>

#V2
:::warning
No support for render flat in V2 yet.
:::