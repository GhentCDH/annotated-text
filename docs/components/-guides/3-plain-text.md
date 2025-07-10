# Plain text

By default, the `AnnotatedText` component uses an internal lines model to display the text.

You can use the `PlainTextAdapter` to adapt the component to work with plain text instead of lines.

```typescript
import { createAnnotatedText, PlainTextAdapter } from "@ghentcdh/vue-component-annotated-text";

const textAnnotation = createAnnotatedText(id,
  {
    lineAdapter: PlainTextAdapter(),
  })
  .setText(plainText.text)
  .setAnnotations(plainText.annotations);
```

The original text:
<pre>{{plainText.text}}</pre>

## Example

<div id="plain-text-example"></div>

<script setup>
//
import { onMounted } from "vue";
import { createAnnotatedText, PlainTextAdapter, clearAnnotatedTextCache} from "@ghentcdh/vue-component-annotated-text";
import { plainText } from "@demo";
const id = `plain-text-example`;

onMounted(()=> {
    clearAnnotatedTextCache()
    createAnnotatedText(id,
        {
            text: PlainTextAdapter(),
            annotation: {
                create: true,
                edit: true
            },
        })
    .setText(plainText.text)
    .setAnnotations(plainText.annotations);
});

</script>

