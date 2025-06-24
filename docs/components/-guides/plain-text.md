# Plain text

Instead of using lines, this component uses a plain text string with annotations.

The original text:
<pre>{{plainText.text}}</pre>

## Example

<div id="plain-text-example">ann</div>

<script setup>
//
import { onMounted, onUnmounted, watch, watchEffect } from "vue";
import { AnnotatedText_ } from "@ghentcdh/vue-component-annotated-text";
import { waitUntilElementExists, plainText } from "@demo";
const id = `plain-text-example`;

waitUntilElementExists(id).then((element) => {
console.log('found element', element);
  createAnnotations();
});

const textAnnotation = AnnotatedText_.init({
    actions: {
        create: true, 
        edit: true
    },  
    onEvent: ({ mouseEvent, event, data }) => {
        console.log(mouseEvent, event, data);
    },
});

const createAnnotations = ()=>{
    textAnnotation.setText(plainText.text, false);
    textAnnotation.setAnnotations(plainText.annotations, false);
    textAnnotation.init(id);
}
</script>

