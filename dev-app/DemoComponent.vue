<script setup lang="ts">
// import { annotationsGreek, textGreek as text } from "./data";

import { reactive } from "vue";

import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import {
  faCircleCheck as faValidate,
  faCircleExclamation as faImportant,
  faCircleMinus as faRemove,
} from "@fortawesome/free-solid-svg-icons";
import type {
  Annotation,
  AnnotationTarget,
  CreateAnnotationState,
  UpdateAnnotationState,
  UserState,
} from "@ghentcdh/vue-component-annotated-text";
import {
  AnnotatedText,
  AnnotatedTextV2,
  Debugger,
  UserActionState,
} from "@ghentcdh/vue-component-annotated-text";
import { textToLines } from "./Utils";
import { annotationsGreek as annotations, textGreek as text } from "./data";
import {
  AnnotationEventData,
  AnnotationEventType,
} from "../src/compute/events";

const textLines = textToLines(text);
// .slice(0, 4);

const annotationMap: Map<string, Annotation> = annotations
  // .filter((a) => ["576753"].some((i) => i === a.id))
  // .slice(0, 2)
  .reduce((map, anno) => {
    map.set(anno.id, { ...anno });
    return map;
  }, new Map());

const hoveredAnnotationsState: Map<string, Annotation> = new Map();
const selectedAnnotations: Map<string, Annotation> = new Map();

const props = reactive({
  showLabels: false,
  showSelects: false,
  debug: false,
  verbose: false,
  target: "text" as AnnotationTarget,
  allowEdit: true,
  allowCreate: true,
  renderNested: true,
  /**
   * Lists to pass as props to the component(s). Note, if edits are made to the map state the lists need to be rebuilt.
   * Alternatively instead of using maps to hold the states, lists can also be used, but then operations like updating
   * items in them becomes less clean to implement.
   */
  annoList: Array.from(annotationMap.values()),
  hoveredList: Array.from(hoveredAnnotationsState.keys()),
  selectedList: Array.from(selectedAnnotations.keys()),

  secondComponent: false,
});

function slotCondition(slotProps: { annotation: Annotation }) {
  return selectedAnnotations.has(slotProps.annotation.id);
}

const onAnnotationEvent = (
  event: MouseEvent,
  type: AnnotationEventType,
  data: AnnotationEventData,
) => {
  switch (type) {
    case "mouse-enter":
      onAnnotationMouseOver(data.annotation, event);
      break;
    case "mouse-leave":
      onAnnotationMouseLeave(data.annotation, event);
      break;
    case "click":
      Debugger.debug("Annotation clicked: ", data.annotation);
      onAnnotationClick(data.annotation, event);
      break;
    case "annotation-edit--end":
      annotationMap.set(data.annotation.id, data.annotation);
      props.annoList = Array.from(annotationMap.values());
      break;
    case "annotation-create--end":
      annotationMap.set(data.annotation.id, data.annotation);
      props.annoList = Array.from(annotationMap.values());
      break;
    default:
      Debugger.warn("Unhandled annotation event type: ", type);
  }
};

const onAnnotationMouseOver = function (
  annotation: Annotation,
  mouseEvent: MouseEvent,
) {
  hoveredAnnotationsState.set(annotation.id, annotation);
  // console.log(hoveredAnnotations);
  props.hoveredList = Array.from(hoveredAnnotationsState.keys());
};

const onAnnotationMouseLeave = function (
  annotation: Annotation,
  mouseEvent: MouseEvent,
) {
  hoveredAnnotationsState.delete(annotation.id);
  props.hoveredList = Array.from(hoveredAnnotationsState.keys());
};

const onAnnotationClick = function (
  annotation: Annotation,
  e: MouseEvent,
): void {
  if (!selectedAnnotations.has(annotation.id)) {
    selectedAnnotations.set(annotation.id, annotation);
  } else {
    selectedAnnotations.delete(annotation.id);
  }
  props.selectedList = Array.from(selectedAnnotations.keys());
};

const onAnnotationCreateBegin = function (createState: CreateAnnotationState) {
  const annotation: Annotation = {
    id: Math.random().toString().slice(2, 12),
    start: createState.newStart,
    end: createState.newStart,
    // class: "annotation annotation--color-1",
    target: "text",
  };
  createState.initAnnotation(annotation);
};

const onAnnotationCreating = function (createState: CreateAnnotationState) {
  createState.updateCreating();
};

const onAnnotationCreateEnd = function (createState: CreateAnnotationState) {
  annotationMap.set(createState.annotation.id, createState.annotation);
  props.annoList = Array.from(annotationMap.values());
};

const onAnnotationUpdateBegin = function (updateState: UpdateAnnotationState) {
  // updateState.newStart = Math.round(updateState.newStart / 5) * 5;
  // updateState.newEnd = Math.round(updateState.newEnd / 5) * 5;
  updateState.confirmStartUpdating();
};

const onAnnotationUpdating = function (updateState: UpdateAnnotationState) {
  // updateState.newStart = Math.round(updateState.newStart / 5) * 5;
  // updateState.newEnd = Math.round(updateState.newEnd / 5) * 5;
  updateState.confirmUpdate();
};

const onAnnotationUpdateEnd = function (
  updateState: UpdateAnnotationState,
): void {
  Debugger.debug("** Edited: ", updateState.annotation);
  annotationMap.set(updateState.annotation.id, updateState.annotation); // Edit application state
  props.annoList = Array.from(annotationMap.values());
};

const onKeyPressed = function (
  keyEv: KeyboardEvent,
  updateState: UpdateAnnotationState,
  createState: CreateAnnotationState,
  userState: UserState,
): void {
  switch (keyEv.key) {
    case "Escape":
      updateState.resetUpdate();
      createState.resetCreating();
      break;
    case "Delete":
      if (userState.state === UserActionState.UPDATING) {
        annotationMap.delete(updateState.annotation.id);
        props.annoList = Array.from(annotationMap.values());
        updateState.resetUpdate();
      }
      break;
  }
};
</script>

<template>
  <h4>Vue component annotated text</h4>
  <menu>
    <form>
      <input v-model="props.debug" type="checkbox" />
      <label>Debug messages</label>
      | <input v-model="props.verbose" type="checkbox" />
      <label>Verbose messages</label>
      | <input v-model="props.showLabels" type="checkbox" />
      <label>Show labels</label>
      | <input v-model="props.showSelects" type="checkbox" />
      <label>Show checkboxes</label>
      | <input v-model="props.renderNested" type="checkbox" />
      <label>Render nested</label>
      | <input v-model="props.allowEdit" type="checkbox" />
      <label>Allow Edits</label>
      | <input v-model="props.allowCreate" type="checkbox" />
      <label>Allow Create</label>
      | <input v-model="props.secondComponent" type="checkbox" />
      <label>Second Component</label>
    </form>
  </menu>

  <hr />
  <div class="demo-grid">
    <div>
      <h1>V2</h1>
      <AnnotatedTextV2
        v-bind="props"
        key="text"
        :component-id="'1'"
        :annotations="props.annoList"
        :highlight-annotations="props.hoveredList"
        :selected-annotations="props.selectedList"
        :text-lines="textLines"
        :allow-edit="props.allowEdit"
        :allow-create="props.allowCreate"
        @event="onAnnotationEvent"
      />
    </div>
    <div>
      <h1>V1</h1>
      <AnnotatedText
        key="text"
        :component-id="'1'"
        :annotations="props.annoList"
        :hovered-annotations="props.hoveredList"
        :selected-annotations="props.selectedList"
        :lines="textLines"
        :debug="props.debug"
        :verbose="props.verbose"
        :show-labels="props.showLabels"
        :render="props.renderNested ? 'nested' : 'flat'"
        :display="props.target"
        :allow-edit="props.allowEdit"
        :allow-create="props.allowCreate"
        :listen-to-on-updating="false"
        :listen-to-on-update-start="true"
        @annotation-select="onAnnotationClick"
        @annotation-update-begin="onAnnotationUpdateBegin"
        @annotation-updating="onAnnotationUpdating"
        @annotation-update-end="onAnnotationUpdateEnd"
        @key-pressed="onKeyPressed"
        @annotation-create-begin="onAnnotationCreateBegin"
        @annotation-creating="onAnnotationCreating"
        @annotation-create-end="onAnnotationCreateEnd"
        @annotation-mouse-over="onAnnotationMouseOver"
        @annotation-mouse-leave="onAnnotationMouseLeave"
      >
        <template #annotation-after="slotProps">
          <template v-if="slotCondition(slotProps)">
            <span>
              <FontAwesomeIcon :icon="faRemove" style="color: red" />
            </span>
            <span>
              <FontAwesomeIcon :icon="faImportant" style="color: orange" />
            </span>
            <span>
              <FontAwesomeIcon :icon="faValidate" style="color: green" />
            </span>
          </template>
          <input v-if="props.showSelects" type="checkbox" />
        </template>
        <!--      <template #annotation-end="slotProps"> {{slotProps.annotationId}} </template>-->
      </AnnotatedText>
      <AnnotatedText
        v-if="props.secondComponent"
        key="text"
        :component-id="'2'"
        :annotations="props.annoList"
        :hovered-annotations="props.hoveredList"
        :selected-annotations="props.selectedList"
        :lines="textLines"
        :debug="props.debug"
        :show-labels="props.showLabels"
        :render="props.renderNested ? 'nested' : 'flat'"
        :display="props.target"
        :allow-edit="props.allowEdit"
        :allow-create="props.allowCreate"
        :listen-to-on-key-pressed="true"
        @annotation-select="onAnnotationClick"
        @annotation-update-begin="onAnnotationUpdateBegin"
        @annotation-updating="onAnnotationUpdating"
        @annotation-update-end="onAnnotationUpdateEnd"
        @key-pressed="onKeyPressed"
        @annotation-create-begin="onAnnotationCreateBegin"
        @annotation-creating="onAnnotationCreating"
        @annotation-create-end="onAnnotationCreateEnd"
        @annotation-mouse-over="onAnnotationMouseOver"
        @annotation-mouse-leave="onAnnotationMouseLeave"
      />
    </div>
  </div>
</template>

<style>
body {
  font-family: sans-serif;
  padding: 2em;
}

hr {
  border: 1px solid gray;
  margin-bottom: 1em;
}

menu {
  padding: 0;
}

.text-components {
  display: flex;
  flex-direction: row;
}
</style>
