# Scroll To Annotation

An annotation can be scrolled to by using the `scrollToAnnotation` method on the `AnnotatedText` instance. This method
takes an annotation ID as an argument and scrolls the view to that annotation.

```ts
    annotatedText.scrollToAnnotation(annotationId);
``` 

# Example

<ClientOnly>
<div style="display: grid;
  grid-template-columns: repeat(2, 1fr);">
    <div id="annotated-scroll"></div>
</div>

<script setup>
//
import { scrollToAnnotation } from "@demo";

scrollToAnnotation('annotated-scroll')

</script>
</ClientOnly>
