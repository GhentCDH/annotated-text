# Adapters

Adapters are used to provide functionality to convert, or create cusome visualization options.

For now 2 kind of adapters are available:

- **LineAdapter**: For converting text lines to a custom format.
- **AnnotationAdapter**: For converting annotations to a custom format.

## How to use a parser

First set the parser befor adding annotations to the `AnnotatedText` component. The parser can be set with the
`setParser` method.

Then add annotations with the `setAnnotations` method. The method accepts an array of W3C annotations and a boolean to
indicate whether to update the view or not.

```typescript
import { AnnotationW3CParser } from "@ghentcdh/vue-component-annotated-text";

textAnnotation.setParser(customParseAnnotations());
textAnnotation.setAnnotations(customAnnotations);
```

## LineAdapter

The **default** adapter is the adapter that uses the internal format.

- [PlainTextAdapter](../-guides/plain-text.md) Plain text adapter is also available to convert text lines to a plain
  text
  format.

### Create your own LineAdapter

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
