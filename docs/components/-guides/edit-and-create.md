# Edit and Create Annotations

By default, edit and create annotations are disabled.
You can enable them by on the AnotationAdapter when creating the AnnotatedText component.

```typescript
import { createAnnotatedText } from "@ghentcdh/vue-component-annotated-text";

createAnnotatedText(id,
  {
    annotation: { edit: true, create: true },
  })
```

Or you can enable/disable them on the fly by.

```typescript
import { createAnnotatedText } from "@ghentcdh/vue-component-annotated-text";

// Create the annotated text component with the ID
const textAnnotation = createAnnotatedText(id);

// Enable/or disable them on the fly
textAnnotation.annotationAdapter.enableEdit(true);
textAnnotation.annotationAdapter.enableCreate(true);

```

## Example

<div id="create-edit-example"></div>

<script setup>
//
import { onMounted, onUnmounted, watch, watchEffect } from "vue";
import { createAnnotatedText, PlainTextAdapter } from "@ghentcdh/vue-component-annotated-text";
import { lines, annotations, waitUntilElementExists } from "@demo";
const id = `create-edit-example`;

waitUntilElementExists(id).then((element) => {
    createAnnotatedText(id,
        {
            annotation: {edit: true, create: true},
        })
    .setLines(lines)
    .setAnnotations(annotations);
});

</script>

