# Getting started

In a web application, first you need to create a container for the AnnotatedText component. This container will be used
to render the component and its annotations.

## Quick start

```html

<div :id="id"></div>
```

Once the container is created and available in the DOM, you can create an instance of the AnnotatedText component with
`createAnnotatedText`.
By default the text will be rendered as PlainText, but you can also use an adapter to render the lines in another
format.

```ts
import { createAnnotatedText } from "@ghentcdh/annotated-text";

const id = `annotated-text-{uuid}`;

const textAnnotation = createAnnotatedText(id)
  .setText(text)
  .setAnnotations(annotations);
``` 

Don't forget to replace do destroy the component when it is no longer needed to avoid memory leaks.

```ts
  textAnnotation.destroy();
```

Add the styling to your css

```css
@import '@ghentcdh/annotated-text/annotated-text.css';
```

## Example

<div id="annotated-text-greek"></div>

<script setup>
//
import { onMounted, onUnmounted } from "vue";
import { createAnnotatedText, TextLineAdapter, clearAnnotatedTextCache} from "@ghentcdh/annotated-text";
import { greekText } from "@demo";
const id = `annotated-text-greek`;

onMounted(()=> {
    clearAnnotatedTextCache()
    createAnnotatedText(id,  {
        text: TextLineAdapter()
    })
    .setText(greekText.text)
    .setAnnotations(greekText.annotations);
});

</script>

