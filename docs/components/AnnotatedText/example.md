---
AnnotatedText
---

# Example

<script setup>
import {
  AnnotatedText,
  Debugger,
  UserActionState,
} from "@ghentcdh/vue-component-annotated-text";
import { lines, annotations } from "@demo";


const  onMouseDown=(e, payload) =>{
 console.log('mouse Down', e, payload);
}

function onMouseMove(e, payload) {
 console.log('mouse Move', e, payload);
}

const annot = annotations;
const textLines = lines
</script>

## Line read only component

<AnnotatedText
key="text"
:component-id="'1'"
:annotations="annot"
:lines="textLines"
/>

<style module>
</style>