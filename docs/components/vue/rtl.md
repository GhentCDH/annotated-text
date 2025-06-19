# Right to left

:::info
Right to left support is currently in beta mode and only available for v2 of the component.
:::
<script setup>
//
import {
  AnnotatedText,
  AnnotatedTextV2,
  Debugger,
  UserActionState,
} from "@ghentcdh/vue-component-annotated-text";
import { lines, annotations } from '@demo';
import { cloneDeep } from 'lodash-es';

const  onMouseDown=(e, payload) =>{
 console.log('mouse Down', e, payload);
}

function onMouseMove(e, payload) {
 console.log('mouse Move', e, payload);
}

const annot = annotations.slice(0,4);
const annotations_1 = cloneDeep(annot);
const annotations_2 = cloneDeep(annot);
const annotations_3 = cloneDeep(annot);


const textLines = lines.slice(0,4);
const textLines_1 = cloneDeep(textLines);
const textLines_2 = cloneDeep(textLines);
const textLines_3 = cloneDeep(textLines);
</script>

<AnnotatedTextV2
key="text"
:component-id="'1'"
:annotations="annotations_3"
:text-lines="textLines_3"
:rtl="true"
/>
