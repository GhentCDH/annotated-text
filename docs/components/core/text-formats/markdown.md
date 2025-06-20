# Markdown

::: warning
To be implemented
:::

The original text:
<pre>{{markdownText.text}}</pre>

## Example

<div id="markdown-text">ann</div>

<script setup>
//
import { onMounted, onUnmounted, watch, watchEffect } from "vue";
import { AnnotatedText_ } from "@ghentcdh/vue-component-annotated-text";
import { waitUntilElementExists, markdownText } from "@demo";
const id = `markdown-text`;

waitUntilElementExists(id).then((element) => {
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
    textAnnotation.setText(markdownText.text, false);
    textAnnotation.setAnnotations(markdownText.annotations, false);
    textAnnotation.init(id);
}
</script>

