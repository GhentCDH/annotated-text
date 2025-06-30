# Snapper

The snapper is a utility that allows you to adjust the start and end positions of annotations based on user actions. It
can be used to create a more intuitive user experience when interacting with annotations.
F.E. when you want to use a word snapper, you can use the snapper to adjust the start and end positions of the
annotation to the nearest word boundaries.

## Example

An example of how to use the snapper, to adjust the start and end positions of an annotation when it is moved or
created.

```typescript

const useSnapper: SnapperFn = (
  action: SnapperAction,
  annotation: TextAnnotation,
) => {
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

createAnnotatedText(id,
  {
    annotation: {
      edit: true,
      create: true,
      snapper: useSnapper
    },
  });

```

<script setup>
//
import { onMounted, onUnmounted, watch, watchEffect } from "vue";
import { createAnnotatedText, TextLineAdapter } from "@ghentcdh/vue-component-annotated-text";
import { greekText, waitUntilElementExists } from "@demo";


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

const id = `simpleSnapper`;

waitUntilElementExists(id).then((element) => {
const textAnnotation = createAnnotatedText(id,
{
text: TextLineAdapter(),
annotation: {
edit: true,
create: true,
snapper: useSnapper
},
})
.setText(greekText.text)
.setAnnotations(greekText.annotations);
});


</script>


<div id="simpleSnapper"></div>
