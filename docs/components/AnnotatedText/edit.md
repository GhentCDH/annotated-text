---
AnnotatedText
---

# AnnotatedText

<script setup>
import {
  AnnotatedText,
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

## Line read only component
<ClientOnly>
<AnnotatedText
    key="text"
    :component-id="'1'" 
    :annotations="annotations_1"
    :lines="textLines_1"
/>
</ClientOnly>

## Line edit only component

<AnnotatedText
key="text"
:component-id="'2'"
:annotations="annotations_2"
:lines="textLines_2"
:allow-edit="true"
/>

## Line edit and create component
<AnnotatedText
key="text"
:component-id="'3'"
:annotations="annotations_3"
:lines="textLines_3"
:allow-edit="true"
:allow-create="true"
/>

<style module>
</style>