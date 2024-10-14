---
AnnotatedText
---

# AnnotatedText

<script setup>
import {
  AnnotatedText,
  Debugger,
  UserActionState,
} from "../../src";
import { lines } from '../demo/line';
import { annotations } from '../demo/annotations';


const  onMouseDown=(e, payload) =>{
 console.log('mouse Down', e, payload);
}

function onMouseMove(e, payload) {
 console.log('mouse Move', e, payload);
}

const annot = annotations.slice(0,4);
const textLines = lines.slice(0,4)
</script>

## Line read only component
<AnnotatedText
    key="text"
    :component-id="'1'" 
    :annotations="annot"
    :lines="textLines"
/>

## Line edit only component
<AnnotatedText
key="text"
:component-id="'2'"
:annotations="annot"
:lines="textLines"
:allow-edit="true"
/>

## Line edit and create component
<AnnotatedText
key="text"
:component-id="'3'"
:annotations="annot"
:lines="textLines"
:allow-edit="true"
:allow-create="true"
/>

<style module>
.button {
  color: red;
  font-weight: bold;
}
</style>