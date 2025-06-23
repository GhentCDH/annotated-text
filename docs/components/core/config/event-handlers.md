# Event handling

Annotation events are handled by the annotation component. The component emits different events based on user
interactions with the annotations.

A annotation listener can be added through the configuration of the component.

```typescript
const textAnnotation = AnnotatedText_.init({
  onEvent: ({ mouseEvent, event, data }) => {
    console.log(mouseEvent, event, data);
  },
});
```

By default the events will be logged to the console with debug statements.

## Events

| Event Type               | Description                                                                                        |
|--------------------------|----------------------------------------------------------------------------------------------------|
| mouse-enter              | Emitted when the mouse enters (or hover) an annotation.                                            |
| mouse-leave              | Emitted when the mouse leaves an annotation.                                                       |
| click                    | Emitted when an annotation is clicked, and not other action like edit/create is performed          |
| dblclick                 | Emitted when an annotation is double-clicked, and not other action like edit/create is performed   |
| annotation-edit--start   | Emitted when an annotation is being edited. This is the first event in the edit process.           |
| annotation-edit--move    | Emitted when an annotation is being moved during the edit process.                                 |
| annotation-edit--end     | Emitted when an annotation edit is completed. This is the last event in the edit process.          |
| annotation-create--start | Emitted when a new annotation is being created. This is the first event in the create process.     |
| annotation-create--move  | Emitted when a new annotation is being moved during the create process.                            |
| annotation-create--end   | Emitted when a new annotation creation is completed. This is the last event in the create process. |

## Examples

<script setup>
//
import { onMounted, onUnmounted, watch, watchEffect } from "vue";
import { AnnotatedText_ } from "@ghentcdh/vue-component-annotated-text";
import { lines, annotations, waitUntilElementExists } from "@demo";

const textAnnotations = annotations.slice(0,6);
const textLines = lines.slice(0,4);

const createAnnotations = (id, config) => {
    console.log("createAnnotations", id, config);
    waitUntilElementExists(id).then((element) => {
        const textAnnotation = AnnotatedText_.init(config);
        textAnnotation.setLines(textLines, false);
        textAnnotation.setAnnotations(textAnnotations, false);
        textAnnotation.init(id);
    });
}

createAnnotations("annotation-log", {
    actions: {
        create: true,
        edit: true,
    },
    onEvent: ({ mouseEvent, event, data }) => {
        console.log(mouseEvent, event, data);
        const logger = document.getElementById("annotation-logger");
        logger.innerHTML = `<p><b>${event}</b>: ${data.annotation.id}</p>`;
        const log = document.getElementById("annotation-log");
        // log.scrollTop = log.scrollHeight; // Scroll to the bottom
    }
});

</script>

### Log all events

<div id="annotation-log"></div>
<pre id="annotation-logger"></pre>
