---
AnnotatedText
---

# Example

<script setup>
//
import {
  AnnotatedText,
  Debugger,
  UserActionState,
  AnnotatedTextV2
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

## V2

<AnnotatedTextV2
key="text"
:component-id="'1'"
:annotations="annot"
:text-lines="textLines"
/>