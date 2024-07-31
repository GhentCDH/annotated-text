<template>
  <h4>Vue component annotated text</h4>
  <menu>
    <form>
      <input
        id="nested"
        v-model="props.target"
        type="radio"
        value="span"
      /><label for="span">Span</label>
      <input id="gutter" v-model="props.target" type="radio" value="gutter" />
      <label for="gutter">Gutter</label>
      | <input v-model="props.debug" type="checkbox" />
      <label>Debug messages</label>
      | <input v-model="props.showLabels" type="checkbox" />
      <label>Show labels</label>
      | <input v-model="props.allowEdit" type="checkbox" />
      <label>Allow Edits</label>
      | <input v-model="props.allowCreate" type="checkbox" />
      <label>Allow Create</label>
      | <input v-model="props.secondComponent" type="checkbox" />
      <label>Second Component</label>
    </form>
  </menu>

  <hr />
  <div class="text-components">
    <AnnotatedText
      key="text"
      text="012345678901234567890123456789"
      :component-id="'1'"
      :annotations="props.annoList"
      :hovered-annotations="props.hoveredList"
      :selected-annotations="props.selectedList"
      :lines="textLines"
      :debug="props.debug"
      :show-labels="props.showLabels"
      render="nested"
      :display="props.target"
      :allow-edit="props.allowEdit"
      :allow-create="props.allowCreate"
      :listen-to-on-updating="false"
      :listen-to-on-update-start="true"
      @annotation-select="onAnnotationClick"
      @annotation-update-start="onAnnotationUpdateStart"
      @annotation-updating="onAnnotationUpdating"
      @annotation-update-end="onAnnotationUpdateEnd"
      @key-pressed="onKeyPressed"
      @annotation-create-start="onAnnotationCreateStart"
      @annotation-creating="onAnnotationCreating"
      @annotation-create-end="onAnnotationCreateEnd"
      @annotation-mouse-over="onAnnotationMouseOver"
      @annotation-mouse-leave="onAnnotationMouseLeave"
    >
      <template #annotation-end="slotProps">
        <div v-if="endSlotCondition(slotProps)">
          <button>test</button>
        </div>
      </template>
      <!--      <template #annotation-end="slotProps"> {{slotProps.annotationId}} </template>-->
    </AnnotatedText>
    <AnnotatedText
      v-if="props.secondComponent"
      key="text"
      text="012345678901234567890123456789"
      :component-id="'2'"
      :annotations="props.annoList"
      :lines="textLines"
      :debug="props.debug"
      :show-labels="props.showLabels"
      render="nested"
      :display="props.target"
      :allow-edit="props.allowEdit"
      :allow-create="props.allowCreate"
      :listen-to-on-key-pressed="true"
      @annotation-select="onAnnotationClick"
      @annotation-updating="onAnnotationUpdating"
      @annotation-update-end="onAnnotationUpdateEnd"
      @key-pressed="onKeyPressed"
      @annotation-create-start="onAnnotationCreateStart"
      @annotation-creating="onAnnotationCreating"
      @annotation-create-end="onAnnotationCreateEnd"
    />
  </div>
</template>

<script setup lang="ts">
import { AnnotatedText, Annotation, AnnotationTarget } from "@/index";
import { textToLines } from "./Utils";

import { annotationsGreek, textGreek as text } from "./data";

import { reactive } from "vue-demi";
import {
  CreateAnnotationState,
  UpdateAnnotationState,
  UserActionState,
  UserState,
} from "@/lib/annotatedTextUtils/StateClasses";

const textLines = textToLines(text);

const annotations: Map<string, Annotation> = annotationsGreek.reduce(
  (map, anno) => {
    map.set(anno.id, { ...anno, visible: true });
    return map;
  },
  new Map()
);

const hoveredAnnotationsState: Map<string, Annotation> = new Map();
const selectedAnnotations: Map<string, Annotation> = new Map();

const props = reactive({
  showLabels: false,
  debug: false,
  target: "span" as AnnotationTarget,
  allowEdit: true,
  allowCreate: true,
  annoList: Array.from(annotations.values()),
  hoveredList: Array.from(hoveredAnnotationsState.keys()),
  selectedList: Array.from(selectedAnnotations.keys()),
  secondComponent: false,
});

function endSlotCondition(slotProps: { annotation: Annotation }) {
  return selectedAnnotations.has(slotProps.annotation.id);
}

const onAnnotationMouseOver = function (
  hoveredAnnotations: Annotation[],
  mouseEvent: MouseEvent
) {
  hoveredAnnotations.forEach((a) => {
    hoveredAnnotationsState.set(a.id, a);
  });
  console.log(hoveredAnnotations);
  props.hoveredList = Array.from(hoveredAnnotationsState.keys());
};

const onAnnotationMouseLeave = function (
  hoveredAnnotations: Annotation[],
  mouseEvent: MouseEvent
) {
  hoveredAnnotations.forEach((a) => {
    hoveredAnnotationsState.delete(a.id);
  });
  props.hoveredList = Array.from(hoveredAnnotationsState.keys());
};

const onAnnotationClick = function (
  annotation: Annotation,
  e: MouseEvent
): void {
  if (!selectedAnnotations.has(annotation.id)) {
    selectedAnnotations.set(annotation.id, annotation);
  } else {
    selectedAnnotations.delete(annotation.id);
  }
  props.selectedList = Array.from(selectedAnnotations.keys());
  console.log("click");
  console.log(selectedAnnotations);
};

const onAnnotationCreateStart = function (createState: CreateAnnotationState) {
  const annotation: Annotation = {
    id: Math.random().toString().slice(2, 12),
    start: createState.newStart,
    end: createState.newStart,
    class: "annotation annotation--color-1",
    target: "span",
    active: true,
    visible: true,
  };
  createState.initAnnotation(annotation);
};

const onAnnotationCreating = function (createState: CreateAnnotationState) {
  createState.updateCreating();
};

const onAnnotationCreateEnd = function (createState: CreateAnnotationState) {
  annotations.set(createState.annotation.id, createState.annotation);
  props.annoList = Array.from(annotations.values());
};

const onAnnotationUpdateStart = function (updateState: UpdateAnnotationState) {
  updateState.newStart = Math.round(updateState.newStart / 5) * 5;
  updateState.newEnd = Math.round(updateState.newEnd / 5) * 5;
  updateState.confirmStartUpdating();
};

const onAnnotationUpdating = function (updateState: UpdateAnnotationState) {
  updateState.newStart = Math.round(updateState.newStart / 5) * 5;
  updateState.newEnd = Math.round(updateState.newEnd / 5) * 5;
  updateState.confirmUpdate();
};

const onAnnotationUpdateEnd = function (
  updateState: UpdateAnnotationState
): void {
  props.debug && console.log("** Edited: ", updateState.annotation);
  annotations.set(updateState.annotation.id, updateState.annotation); // Edit application state
  props.annoList = Array.from(annotations.values());
};

const onKeyPressed = function (
  keyEv: KeyboardEvent,
  updateState: UpdateAnnotationState,
  createState: CreateAnnotationState,
  userState: UserState
): void {
  switch (keyEv.key) {
    case "Escape":
      updateState.resetUpdate();
      createState.resetCreating();
      break;
    case "Delete":
      if (userState.value === UserActionState.UPDATING) {
        annotations.delete(updateState.annotation.id);
        props.annoList = Array.from(annotations.values());
        updateState.resetUpdate();
      }
      break;
  }
};
</script>

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
