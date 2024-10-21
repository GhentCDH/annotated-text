---
AnnotatedText
---

# Event handling

## Mouse events

<script setup>
import {
  AnnotatedText,
  Debugger,
  UserActionState,
} from "../../../src";
import { lines } from "../../demo/line";
import { annotations } from "../../demo/annotations"; 


const  onMouseDown=(e, payload) =>{
 console.log("mouse Down", e, payload);
}

function onMouseMove(e, payload) {
 console.log("mouse Move", e, payload);
}

const annot = annotations;
const textLines = lines.slice(0,4);
const clickedAnnotation = null;
const dblClickedAnnotation = null;

const onAnnotationClick = function (updateState) {
 clickedAnnotation = annotation;
};
const onAnnotationDblClick = function (annotation) {
 dblClickedAnnotation = annotation;
};
</script>

### Click event

<AnnotatedText
:annotations="annot"
:lines="textLines"
@annotation-click="onAnnotationClick"
/>
:::info
Clicked annotation: {{onAnnotationClick}}
:::

```vue

<AnnotatedText
  :annotations="annot"
  :lines="textLines"
  @annotation-click="onAnnotationDblClick"
/>
```

### Double click event

<AnnotatedText
:annotations="annot"
:lines="textLines"
@annotation-dblClick="onAnnotationDblClick"
/>

:::info
Clicked annotation: {{dblClickedAnnotation}}
:::

```vue

<AnnotatedText
  :annotations="annot"
  :lines="textLines"
  @annotation-dblClick="onAnnotationDblClick"
/>
```

## Other events

:::warning
Add more event handler documentation
:::

## Documentation on emits:

[Annotated Text Emits](/api/type-aliases/AnnotatedTextEmits.html)
