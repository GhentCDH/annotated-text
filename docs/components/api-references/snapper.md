# Snapper

The snapper is a utility that allows you to adjust the start and end positions of annotations based on user actions. It
can be used to create a more intuitive user experience when interacting with annotations.
F.E. when you want to use a word snapper, you can use the snapper to adjust the start and end positions of the
annotation to the nearest word boundaries.

The default snapper just returns the start and end positions of the annotation without any modifications.

Following snappers are available:

- **WordSnapper**: This snapper adjusts the start and end positions of the annotation to the nearest word boundaries.

## Example

An example of how to use the snapper, to adjust the start and end positions of an annotation when it is moved or
created.

```typescript
class CustomSnapper extends Snapper {
  fixOffset(action: SnapperAction, annotation: TextAnnotation): SnapperResult {
    const { start, end } = annotation;
    switch (action) {
      case "move-end":
        return { start, end: end - 2, modified: true };
      case "move-start":
        return { start: start + 2, end, modified: true };
    }
    return { start, end, modified: false };
  }
}

createAnnotatedText(id,
  {
    annotation: {
      edit: true,
      create: true,
      snapper: new CustomSnapper(),
    },
  });

``` 

<div id="annotation--snapper"></div>

<script setup>
//
import { snapper } from "@demo";

snapper('annotation--snapper')

</script>


