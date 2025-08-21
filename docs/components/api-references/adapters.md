# Adapters

Adapters are used to provide functionality to convert, or create cusome visualization options.

For now 2 kind of adapters are available:

- **TextAdapter**: For converting text string to the internal textLines.
- **AnnotationAdapter**: For converting annotations to a custom format.

## How to use a adapter

While using `createAnnotatedText` you can pass the adapter as an option to the `text` or `annotation` property.
You can also pass properties that will be used by the default adapter. f.e. `textDirection` for the text adapter.

```typescript
import { TextLineAdapter } from "@ghentcdh/annotated_text";

createAnnotatedText(id, {
  text: TextLineAdapter(),
  annotation: W3CAnnotationAdapter()
})
```

## TextAdapter

The **default** adapter is the PlainTextAdapter.

- [PlainTextAdapter](../-guides/3-plain-text) Plain text adapter converts the text to single line text, splitting the
  text on newlines `\n`.
- [MarkdownTextAdapter](../-guides/3-markdown) Markdown text adapter converts the text to a markdown format, stripping
  out the markdown syntax.
- [TextLineAdapter](../-guides/text-line.md) Text line adapter converts the text to a line based format, splitting the
  text on newlines `\n` and filter out the textline numbers.

### Create your own TextAdapter

:::info
Add the docs
:::

## AnnotationAdapter

The **default** adapter is the adapter that uses the internal format.

- [W3C Web Annotation Data Model parser](../-guides/w3c.md)
  is available to convert annotations to the W3C Web Annotation Data Model format.

### Create your own AnnotationAdapter

:::info
Add the docs
:::
