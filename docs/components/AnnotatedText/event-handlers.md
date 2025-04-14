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
} from "@ghentcdh/vue-component-annotated-text";
import {ref } from "vue";
import { lines , annotations } from "@demo"; 


const  onMouseDown=(e, payload) =>{
 console.log("mouse Down", e, payload);
}

function onMouseMove(e, payload) {
 console.log("mouse Move", e, payload);
}

const annot = annotations;
const textLines = lines.slice(0,4);
const clickedAnnotation = ref(null);
const dblClickedAnnotation = ref(null);

const onAnnotationClick = function (payload) {
 clickedAnnotation.value=JSON.stringify( payload?.annotation, null, 4);

};
const onAnnotationDblClick = function (payload) {
 dblClickedAnnotation.value=JSON.stringify( payload?.annotation, null, 4);
};
</script>

### Click event

```vue

<AnnotatedText
  :annotations="annot"
  :lines="textLines"
  @annotation-click="onAnnotationClick"
/>
```

<AnnotatedText
:annotations="annot"
:lines="textLines"
@annotation-click="onAnnotationClick"
/>

Clicked annotation:
<pre>{{clickedAnnotation}}</pre>

### Double click event

```vue

<AnnotatedText
  :annotations="annot"
  :lines="textLines"
  @annotation-double-click="onAnnotationDblClick"
/>
```

<AnnotatedText
:annotations="annot"
:lines="textLines"
@annotation-double-click="onAnnotationDblClick"
/>
Double Clicked annotation:
<pre>{{dblClickedAnnotation}}</pre>

## Other events

:::warning
Add more event handler documentation
:::

## Documentation on emits:

[Annotated Text Emits](/api/type-aliases/AnnotatedTextEmits.html)
