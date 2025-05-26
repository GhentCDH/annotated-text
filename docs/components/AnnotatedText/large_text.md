# Large text with large annotation set
# Example

<script setup>
//
import {
  AnnotatedText,
  Debugger,
  UserActionState,
} from "@ghentcdh/vue-component-annotated-text";
import { largeTextLines, largeAnntoations } from "@demo";


const  onMouseDown=(e, payload) =>{
 console.log('mouse Down', e, payload);
}

function onMouseMove(e, payload) {
 console.log('mouse Move', e, payload);
}

const annot = largeAnntoations;
const textLines = largeTextLines
</script>


<AnnotatedText
key="text"
:component-id="'1'"
:annotations="annot"
:lines="textLines"
/>

