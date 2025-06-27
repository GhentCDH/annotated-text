# Web annotation Data Model

W3C annotation formats are used to create annotations that can be shared and reused across different platforms and
applications. They are based on the W3C Web Annotation Data Model and can be used to annotate text, images, and other
resources.

> More information can be found in the [W3C Web Annotation Data Model](https://www.w3.org/TR/annotation-model/)
> specification.

:::info
W3C text annotations are partially implemented, check the documentation for implementation details.
:::

## Quick start

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

First set the parser before adding annotations to the `AnnotatedText` component. The parser can be set with the
`setParser` method.

Then add annotations with the `setAnnotations` method. The method accepts an array of W3C annotations and a boolean to
indicate whether to update the view or not.

```typescript
import { createAnnotatedText, W3CAnnotationAdapter } from "@ghentcdh/vue-component-annotated-text";

createAnnotatedText(id, {
  annotation: W3CAnnotationAdapter()
})
  .setLines(w3cText.text, false)
  .setAnnotations(w3cText.w3cAnnotations.items)
```

### Example

<div id="w3c-simple-text"></div>
<pre id="w3c-simple-text--logger"></pre>

### Example with multiple sources

Sometimes you might have annotations from different sources. In that case, you can specify the source ID when
initializing the parser.

```typescript 
  annotation: W3CAnnotationAdapter({
  sourceId: `https://example.com/source1`
})
```

<div id="w3c-multiple-sources"></div>
<pre id="w3c-multiple-sources--logger"></pre>

<script setup>
//
import { onMounted, onUnmounted, watch, watchEffect } from "vue";
import { createAnnotatedText, PlainTextAdapter, W3CAnnotationAdapter } from "@ghentcdh/vue-component-annotated-text";
import { waitUntilElementExists, w3cText } from "@demo";

const createAnnotations = (id, sourceId)=>{

    waitUntilElementExists(id).then((element) => {
        createAnnotatedText(id,
            {
               line: PlainTextAdapter(),
                annotation: W3CAnnotationAdapter({  
                    sourceUri: sourceId,
                    create: true,
                    edit: true
                },
            }, )
        .setLines(w3cText.text, false)
        .setAnnotations(w3cText.w3cAnnotations.items)
        .on('all', ({ mouseEvent, event, data }) => {
            const events = [`annotation-create--start`,     
                            `annotation-create--move`, 
                            `annotation-create--end`,
                            `annotation-edit--start`, 
                            `annotation-edit--move`, 
                            `annotation-edit--end`];
            if(!events.includes(event)) return
            const logger = document.getElementById(`${id}--logger`);
console.log(data)
            if(!logger) return;
            logger.innerHTML = `<p><b>${event}</b>: ${JSON.stringify(data.annotation, null, 2)}</p>`;
        });
    });
}

createAnnotations(`w3c-simple-text`);
createAnnotations(`w3c-multiple-sources`, w3cText.sourceId);

</script>
