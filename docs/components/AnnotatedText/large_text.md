# Large text with large annotation set

# Example

<script setup>
//
import {
  AnnotatedTextV2,
  Debugger,
  UserActionState,
} from "@ghentcdh/vue-component-annotated-text";
import { largeTextLines, largeAnnotations } from "@demo";


const  onMouseDown=(e, payload) =>{
 console.log('mouse Down', e, payload);
}

function onMouseMove(e, payload) {
 console.log('mouse Move', e, payload);
}

const annot = largeAnnotations;
const textLines = largeTextLines
</script>


<AnnotatedTextV2
key="text"
:component-id="'1'"
:annotations="annot"
:text-lines="textLines"
/>

