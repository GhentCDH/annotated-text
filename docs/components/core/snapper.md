# Snapper

The snapper is a utility that allows you to adjust the start and end positions of annotations based on user actions. It
can be used to create a more intuitive user experience when interacting with annotations.
F.E. when you want to use a word snapper, you can use the snapper to adjust the start and end positions of the
annotation to the nearest word boundaries.

## Example

An example of how to use the snapper, to adjust the start and end positions of an annotation when it is moved or
created.

```typescript

const useSnapper = (action, payload) => {
  const { start, end } = payload;
  switch (action) {
    case 'move-end':
      return { start, end: end - 2 };
      break;
    case 'move-start':
      return { start: start + 2, end };
      break;
  }

  return { start, end };
};

```

<script setup>
//
import { onMounted, onUnmounted, watch, watchEffect } from "vue";
import { AnnotatedText_ } from "@ghentcdh/vue-component-annotated-text";
import { lines, annotations, waitUntilElementExists } from "@demo";

const textAnnotations = annotations;
const textLines = lines;

const useSnapper = (action, payload) => {
  const { start, end } = payload;
  switch (action) {
    case 'move-end':
      return { start, end: end - 2 };
      break;
    case 'move-start':
      return { start: start + 2, end };
      break;
  }
  return { start, end };
};

const createAnnotations = (id, config) => {
    waitUntilElementExists(id).then((element) => {
        const textAnnotation = AnnotatedText_.init(config);
        textAnnotation.setLines(textLines, false);
        textAnnotation.setAnnotations(textAnnotations, false);
        textAnnotation.init(id);
    });
}

createAnnotations("simpleSnapper", {
    actions: {
      create: true,
      edit: true,
    },
     visualEvent: {
      useSnapper: useSnapper,
    },
});

</script>

<div id="simpleSnapper"></div>
