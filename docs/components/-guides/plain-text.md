# Plain text

By default, the `AnnotatedText` component uses an internal lines model to display the text.

You can use the `PlainTextAdapter` to adapt the component to work with plain text instead of lines.

```typescript
import { createAnnotatedText, PlainTextAdapter } from "@ghentcdh/vue-component-annotated-text";

const textAnnotation = createAnnotatedText(id,
  {
    lineAdapter: PlainTextAdapter(),
  })
  .setLines(plainText.lines)
  .setAnnotations(plainText.annotations);
```

The original text:
<pre>{{plainText.text}}</pre>

## Example

<div id="plain-text-example"></div>

<script setup>
//
import { onMounted, onUnmounted, watch, watchEffect } from "vue";
import { createAnnotatedText, PlainTextAdapter } from "@ghentcdh/vue-component-annotated-text";
import { waitUntilElementExists, plainText } from "@demo";
const id = `plain-text-example`;

waitUntilElementExists(id).then((element) => {
    createAnnotatedText(id,
        {
            line: PlainTextAdapter(),
            annotation: {
                create: true,
                edit: true
            },
        })
    .setLines(plainText.text)
    .setAnnotations(plainText.annotations);
});

</script>

