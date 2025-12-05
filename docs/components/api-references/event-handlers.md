# Event handling

Annotation events are handled by the annotation component.
The component emits different events based on user interactions with the annotations.

One or multiple event handlers can be registered to the component using the `on` method.

```typescript
const textAnnotation = createAnnotatedText(id)
  .on('all', ({ mouseEvent, event, data }) => {
    // To handle all events
    console.log(mouseEvent, event, data);
  })
  .on('click', () => {
    // handle click event
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
import { onMounted } from "vue";
import { createEventHandlerDemo } from "@demo";

const id = "annotation-log";

onMounted(()=> {
    createEventHandlerDemo(id);
});


</script>

### Log all events

<div id="annotation-log"></div>
<pre id="annotation-logger"></pre>
