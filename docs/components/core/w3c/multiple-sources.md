# Quick start

The W3C annotation should at least have an `id`, `motivation`, and a `target`. The `target` should contain the
selection.

```json
{
  "id": "ann-1",
  "motivation": "tagging",
  "@context": "http://www.w3.org/ns/anno.jsonld",
  "target": [
    {
      "type": "Text",
      "selector": {
        "start": 228,
        "end": 488,
        "type": "TextPositionSelector"
      }
    }
  ]
}
```

Setting the annotations can be done with the `setW3CAnnotations` method of the `AnnotatedText` component. The method
accepts an array of W3C annotations and a boolean to indicate whether to update the view or not.

```typescript
textAnnotation.setW3CAnnotations(plainText.w3cAnnotations.items, false);
```

## Example

<div id="plain-text-example">ann</div>

<script setup>
//
import { onMounted, onUnmounted, watch, watchEffect } from "vue";
import { AnnotatedText_ } from "@ghentcdh/vue-component-annotated-text";
import { waitUntilElementExists, plainText } from "@demo";
const id = `plain-text-example`;

waitUntilElementExists(id).then((element) => {
  createAnnotations();
});

const textAnnotation = AnnotatedText_.init({
    actions: {
        create: true, 
        edit: true
    },  
    onEvent: ({ mouseEvent, event, data }) => {
        console.log(mouseEvent, event, data);
    },
});

const createAnnotations = ()=>{
    textAnnotation.setText(plainText.text, false);
    textAnnotation.setW3CAnnotations(plainText.w3cAnnotations.items, false);
    textAnnotation.init(id);
}
</script>
