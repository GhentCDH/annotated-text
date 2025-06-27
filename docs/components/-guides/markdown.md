# Markdown Text

Markdown text is supported in the `AnnotatedText` component. You can use the `MarkdownTextAdapter` to render plain text.

The positions of the annotations are based on the absolute text, so markdown is stripped out when calculating the
positions of the annotations.

f.e. ```abc **test** def``` will have the annotation on the text `test` at position 4-8.

## Use

```typescript
import { createAnnotatedText, MarkdownTextAdapter } from "@ghentcdh/vue-component-annotated-text";

const textAnnotation = createAnnotatedText(id,
  {
    lineAdapter: MarkdownTextAdapter(),
  })
  .setLines(plainText.lines)
  .setAnnotations(plainText.annotations);
```

## Example

The original text, rendered as flat text:
<div id="plain-text-example"></div>

### Rendered as markdown text:

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
            line: MarkdownTextAdapter({flatText: true}),
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

