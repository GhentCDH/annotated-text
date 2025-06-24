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
createAnnotatedText(id,
  {
    line: { textDirection: 'rtl' }
  })
  .setLines(textLines)
  .setAnnotations(textAnnotations);
```

### Example

<script setup>
//
import { onMounted, onUnmounted, watch, watchEffect } from "vue";
import { createAnnotatedText } from "@ghentcdh/vue-component-annotated-text";
import { lines, annotations, waitUntilElementExists } from "@demo";

const textAnnotations = annotations;
const textLines = lines;
const id = `rtl`;

waitUntilElementExists(id).then((element) => {
    const textAnnotation = createAnnotatedText(id, 
        {
           line: {textDirection: 'rtl'}
        }, 
        { 
            actions: {
                create: true,
                edit: true,
            }
        }
    )
    .setLines(textLines)
    .setAnnotations(textAnnotations);
});

</script>

## Plain text

Also in plain text mode, the `text.rtl` property can be set to `true` to enable right-to-left rendering.

```typescript
createAnnotatedText(id,
  {
    line: PlainTextAdapter({
      textDirection: 'rtl'
    })
  })
  .setLines(textLines)
  .setAnnotations(textAnnotations);
```

<div id="plain-text-example"></div>

<script setup>
//
import { onMounted, onUnmounted, watch, watchEffect } from "vue";
import { createAnnotatedText, PlainTextAdapter } from "@ghentcdh/vue-component-annotated-text";
import { waitUntilElementExists, plainText } from "@demo";
const id = `plain-text-example`;

waitUntilElementExists(id).then((element) => {
    createAnnotatedText(id,
        {
            line: PlainTextAdapter({
                textDirection: 'rtl'
            })
        }, 
        { actions: {
            create: true, 
            edit: true
        }})
    .setLines(plainText.text)
    .setAnnotations(plainText.annotations);
});
</script>
