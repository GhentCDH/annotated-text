---
AnnotatedText
---

# Render flat

The component can be rendered flat when the property `renderNested` is set to `false`. This will render the annotations
in a flat manner, without nesting them.


<script setup>
import {
  AnnotatedText,
  Debugger,
  UserActionState,
} from "../../../src";
import { lines } from "../../demo/line";
import { annotations } from "../../demo/annotations";



const annot = annotations;
const textLines = lines;
</script>


<AnnotatedText
:annotations="annot"
:lines="textLines"
:render="'flat'"
/>

<style module>
</style>