# Parser

If your annotation consist of a format different from the default, you can use a parser to convert your annotations.

## Implementing a parser

```typescript
const customParseAnnotations: TextAnnotationsParser<MyCustomAnnotation> = () => {
  return {
    parse: (annotation: ANNOTATION): Annotation | null => {
      // Do the magic here to convert your custom annotation to the internal model
      return mappedAnnotation;
    }
    ,
    format: (
      annotation: Annotation,
      selectedText: string,
      isNew: boolean) => ANNOTATION => {
      // Do the magic here to convert your internal model to the custom annotation format
      return mappedAnnotation;
    }
  }
};
```

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

## Default parser

By default the W3C parser is used to parse the annotations. You can set the parser in the `AnnotatedText` component.

> More information can be found in the [W3C Web Annotation Data Model parser](../-guides/w3c.md)
