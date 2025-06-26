# Markdown Text

Markdown text is supported in the `AnnotatedText` component. You can use the `MarkdownTextAdapter` to render plain text
with

```typescript
import { createAnnotatedText, MarkdownTextAdapter } from "@ghentcdh/vue-component-annotated-text";

const textAnnotation = createAnnotatedText(id,
  {
    lineAdapter: MarkdownTextAdapter(),
  })
  .setLines(plainText.lines)
  .setAnnotations(plainText.annotations);
```

The original text:
<pre>{{markdownText.text}}</pre>

## Example

<div id="plain-text-example"></div>
<div id="markdown-text-example"></div>

<script setup>
//
import { onMounted, onUnmounted, watch, watchEffect } from "vue";
import { createAnnotatedText, MarkdownTextAdapter, PlainTextAdapter } from "@ghentcdh/vue-component-annotated-text";
import { waitUntilElementExists, markdownText } from "@demo";
const id = `markdown-text-example`;

const id_   = `plain-text-example`;
waitUntilElementExists(id_).then((element) => {
console.log('----PlainTextAdapter', id_);
    createAnnotatedText(id_,
        {
            line: PlainTextAdapter(),
            annotation: {
                create: true,
                edit: true
            },
        })
    .setLines(markdownText.text)
    .setAnnotations(markdownText.annotations);
});

waitUntilElementExists(id).then((element) => {
console.log('----MarkdownTextAdapter', id_);
    createAnnotatedText(id,
        {
            line: MarkdownTextAdapter(),
            annotation: {
                create: true,
                edit: true
            },
        })
    .setLines(markdownText.text)
    .setAnnotations(markdownText.annotations);
});

</script>

