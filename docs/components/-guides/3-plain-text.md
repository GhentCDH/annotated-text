# Plain text

By default, the text will be rendered as plain text. You can use the `PlainTextAdapter` to render plain text.

```typescript
import { createAnnotatedText, PlainTextAdapter } from "@ghentcdh/annotated-text";

const textAnnotation = createAnnotatedText(id)
  .setTextAdapter(PlainTextAdapter())
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
import { createAnnotatedText, PlainTextAdapter, clearAnnotatedTextCache} from "@ghentcdh/annotated-text";
import { plainText } from "@demo";
const id = `plain-text-example`;

onMounted(()=> {
    clearAnnotatedTextCache()
    createAnnotatedText(id)
    .setTextAdapter(PlainTextAdapter())
    .setAnnotationAdapter({ edit: true, create: true })
    .setStyleParams(plainText.styleParams)
    .setRenderParams(plainText.renderParams)
    .setText(plainText.text)
    .setAnnotations(plainText.annotations);
});

</script>

