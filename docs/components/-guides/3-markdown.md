# Markdown Text

Markdown text is supported in the `AnnotatedText` component. You can use the `MarkdownTextAdapter` to render plain text.

The positions of the annotations are based on the absolute text, so markdown is stripped out when calculating the
positions of the annotations.

f.e. ```abc **test** def``` will have the annotation on the text `test` at position 4-8.

Internally it uses `markdown-it` to format the text, so you can use all the features of `markdown-it` to format the
text.

## Use

```typescript
import { createAnnotatedText, MarkdownTextAdapter } from "@ghentcdh/annotated-text";

const textAnnotation = createAnnotatedText(id)
  .setTextAdapter(MarkdownTextAdapter())
  .setText(`*bold* _italic_ **bold** __underline__ ~~strikethrough~~ \`code\` [link](https://www.google.com)`)
  .setAnnotations([...]);
```

## Example

The original text, rendered as flat text:
<div id="plain-text-example"></div>

### Rendered as markdown text:

<div id="markdown-text-example"></div>

<script setup>
//
import { onMounted } from "vue";
import { createAnnotatedText, MarkdownTextAdapter, PlainTextAdapter, clearAnnotatedTextCache } from "@ghentcdh/annotated-text";
import { markdownText } from "@demo";
const id = `markdown-text-example`;

const id_   = `plain-text-example`;
onMounted(()=> {
    clearAnnotatedTextCache()
    createAnnotatedText(id_)
    .setTextAdapter(MarkdownTextAdapter({flatText: true}))
    .setAnnotationAdapter({ edit: true, create: true })
     .setStyleParams(markdownText.styleParams)
     .setRenderParams(markdownText.renderParams)
    .setText(markdownText.text)
    .setAnnotations(markdownText.annotations);

    createAnnotatedText(id)
     .setTextAdapter(MarkdownTextAdapter())
     .setAnnotationAdapter({ edit: true, create: true })
     .setStyleParams(markdownText.styleParams)
     .setRenderParams(markdownText.renderParams)
     .setText(markdownText.text)
     .setAnnotations(markdownText.annotations);
});

</script>

