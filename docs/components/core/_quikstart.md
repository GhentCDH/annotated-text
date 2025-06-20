# Getting started

In a web application, first you need to create a container for the AnnotatedText component. This container will be used
to render the component and its annotations.

## Quick start

```html

<div :id="id"></div>
```

Once the container is created and available in the DOM, you can create an instance of the AnnotatedText component.
The config can be set to an empty object, as the component will use the default [configuration](./config.md).

```ts
import { AnnotatedText_ } from "@ghentcdh/vue-component-annotated-text";

const id = `annotated-text-{uuid}`;

const textAnnotation = AnnotatedText_.init({});

// Render the textlines and annotations
textAnnotation.setLines(textLines, false);
textAnnotation.setAnnotations(annotations, false);
textAnnotation.init(id);
``` 

Don't forget to replace do destroy the component when it is no longer needed to avoid memory leaks.

```ts
  textAnnotation.destroy();
```

```ts

## Example

<div id="annotated-text" onload="createAnnotations()">ann</div>


<script setup>
//
import { onMounted, onUnmounted, watch, watchEffect } from "vue";
import { AnnotatedText_ } from "@ghentcdh/vue-component-annotated-text";
import { lines, annotations, waitUntilElementExists } from "@demo";
const id = `annotated-text`;

waitUntilElementExists(id).then((element) => {
  createAnnotations();
});

const createAnnotations = ()=>{
    textAnnotation.setLines(lines, false);
    textAnnotation.setAnnotations(annotations, false);
    textAnnotation.init(id);
}
</script>

