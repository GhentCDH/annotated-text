# AnnotatedText

<script setup>
//
import {
  AnnotatedTextV2,
  AnnotatedText,
  Debugger,
  UserActionState,
} from "@ghentcdh/vue-component-annotated-text";
import { lines, annotations } from '@demo'; 


const onMouseDown=(e, payload) =>{
 console.log('mouse Down', e, payload);
}

function onMouseMove(e, payload) {
 console.log('mouse Move', e, payload);
}

const annot = annotations;
const textLines = lines.slice(0,4);

const fixOffset = function (updateState) {
    switch(updateState.action) {
        case 'moveEnd':
          updateState.newEnd = updateState.newEnd+2;
          break;
        case 'moveStart':
          updateState.newStart = updateState.newStart-2;
          break;
    }
};

const onAnnotationUpdateBegin = function (updateState) {
  fixOffset(updateState);

  updateState.confirmStartUpdating();
};
const onAnnotationUpdating = function (updateState) {
  fixOffset(updateState);

  updateState.confirmUpdate();
};

const useSnapper = (action, payload) => { 
    const {start, end} = payload;
    switch(action) {
        case 'move-end':
          return {start, end: end -2};
          break;
        case 'move-start':
          return {start: start +2, end};
          break;
    }
    
    return {start, end};
};

const listenToEvents = (event, type, data)=>{
    switch(type){
        case 'click':
            console.log('click', event, data);
            break;
    }
}
</script>

## A custom line start and end validation

This example shows how to implement a custom line start and end validation. The `onAnnotationUpdateBegin` and
`onAnnotationUpdating` functions are used to adjust the start and end of the annotation. In this example, the start is
decreased by 2 and the end is increased by 2.

<AnnotatedText
:component-id="'1'"
:annotations="annot"
:lines="textLines"
:can-edit="true"
:allow-edit="true"
:listen-to-on-update-start="true"
:listen-to-on-updating="true"
@annotation-update-begin="onAnnotationUpdateBegin"
@annotation-updating="onAnnotationUpdating"
/>
<hr />

## V2

:::warning
TODO add snapper to V2
:::

<AnnotatedTextV2
:component-id="'1'"
:annotations="annot"
:text-lines="textLines"
:can-edit="true"
:allow-edit="true"
:use-snapper="useSnapper"
@event="listenToEvents"
/>

<style module>
</style>
