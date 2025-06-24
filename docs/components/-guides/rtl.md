# Right to left

:::info
Right to left support is currently in beta mode.
:::

Enabling right to left rendering in the AnnotatedText component allows for proper display of languages that are read
from right to left, such as Arabic or Hebrew. This is particularly useful for applications that need to support
multilingual text.

Rtl can be configured in the AnnotatedText component by setting the `text.rtl` property to `true`. This will ensure that
the text is rendered correctly in a right-to-left format.

```typescript
const textAnnotation = AnnotatedText_.init({
  text: {
    rtl: true, // Enable right to left rendering
  },
});
```

### Example

<script setup>
//
import { onMounted, onUnmounted, watch, watchEffect } from "vue";
import { AnnotatedText_ } from "@ghentcdh/vue-component-annotated-text";
import { lines, annotations, waitUntilElementExists } from "@demo";

const textAnnotations = annotations;
const textLines = lines;


const createAnnotations = (id, config) => {
    waitUntilElementExists(id).then((element) => {
        const textAnnotation = AnnotatedText_.init(config);
        textAnnotation.setLines(textLines, false);
        textAnnotation.setAnnotations(textAnnotations, false);
        textAnnotation.init(id);
    });
}

createAnnotations("rtl", {
    actions: {
        create: true,
        edit: true,
    }, 
    text: {
        rtl: true, // Enable right to left rendering
    },
});

</script>

<div id="rtl"></div>
