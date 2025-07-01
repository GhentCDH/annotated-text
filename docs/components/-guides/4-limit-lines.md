# Limit lines to display

You can limit the number of lines displayed in the AnnotatedText component, by passing a `limit` option to the
`TextLineAdapter`.
This limit contains a start and end index in the text, which will be used to determine the lines to display.

```typescript
import { createAnnotatedText } from "@ghentcdh/vue-component-annotated-text";

createAnnotatedText(id,
  {
    text: { limit: { start: 99, end: 180 } }
  })
```

## Example

<div id="create-edit-example"></div>

<script setup>
//
import { onMounted, onUnmounted, watch, watchEffect } from "vue";
import { createAnnotatedText, TextLineAdapter } from "@ghentcdh/vue-component-annotated-text";
import { greekText, waitUntilElementExists } from "@demo";
const id = `create-edit-example`;

waitUntilElementExists(id).then((element) => {
    createAnnotatedText(id,
        {  
            text: TextLineAdapter({limit: {start: 99, end: 180}}),
            annotation: {edit: true, create: true},
        })
    .setText(greekText.text)
    .setAnnotations(greekText.annotations);
});

</script>

