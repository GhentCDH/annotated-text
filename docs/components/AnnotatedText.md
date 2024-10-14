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
.button {
  color: red;
  font-weight: bold;
}
</style>