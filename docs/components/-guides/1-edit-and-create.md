# Edit and Create Annotations

By default, edit and create annotations are disabled.
You can enable them by on the AnotationAdapter when creating the AnnotatedText component.

```typescript
import { createAnnotatedText } from "@ghentcdh/annotated-text";

createAnnotatedText(id,
  {
    annotation: { edit: true, create: true },
  })
```

Or you can enable/disable them on the fly using `setConfig`.

```typescript
import { createAnnotatedText } from "@ghentcdh/annotated-text";

// Create the annotated text component with the ID
const textAnnotation = createAnnotatedText(id);

// Enable/or disable them on the fly using setConfig
textAnnotation.annotationAdapter.setConfig('edit', true);
textAnnotation.annotationAdapter.setConfig('create', true);

// Or directly set the properties
textAnnotation.annotationAdapter.edit = true;
textAnnotation.annotationAdapter.create = true;
```

## Example

<div id="create-edit-example"></div>

<script setup>
//
import { onMounted } from "vue";
import{editAndCreateDemo}from '@demo';
const id = `create-edit-example`;

onMounted(()=> {
    editAndCreateDemo(id);
});
</script>

