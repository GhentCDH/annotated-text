<template>
  <h4>Vue component annotated text</h4>
  <menu>
    <form>
      <input
        id="nested"
        v-model="props.render"
        type="radio"
        value="nested"
      /><label for="nested">Nested</label>
      <input id="flat" v-model="props.render" type="radio" value="flat" />
      <label for="flat">Flat</label>
      | <input v-model="props.debug" type="checkbox" />
      <label>Debug messages</label>
      | <input v-model="props.showLabels" type="checkbox" />
      <label>Show labels</label>
      | <input v-model="props.allowEdit" type="checkbox" />
      <label>Allow Edits</label>
      | <input v-model="props.allowCreate" type="checkbox" />
      <label>Allow Create</label>
    </form>
  </menu>

  <hr />
  <div class="text-components">
    <AnnotatedText
      key="text"
      text="012345678901234567890123456789"
      :component-id="'1'"
      :annotations="props.annoList"
      :lines="textLines"
      :debug="props.debug"
      :show-labels="props.showLabels"
      :render="props.render"
      :allow-edit="props.allowEdit"
      :allow-create="props.allowCreate"
      :listen-to-on-edit-move="true"
      @annotation-select="onAnnotationClick"
      @annotation-edit-moved="onAnnotationMove"
      @annotation-edit-done="onAnnotationEdited"
      @key-pressed="onKeyPressed"
      @annotation-create-start="onCreateStart"
      @annotation-create-move="onCreateMove"
      @annotation-create-done="onCreateDone"
    />
    <AnnotatedText
      key="text"
      text="012345678901234567890123456789"
      :component-id="'2'"
      :annotations="props.annoList"
      :lines="textLines"
      :debug="props.debug"
      :show-labels="props.showLabels"
      :render="props.render"
      :allow-edit="props.allowEdit"
      :allow-create="props.allowCreate"
      :listen-to-on-edit-move="true"
      @annotation-select="onAnnotationClick"
      @annotation-edit-moved="onAnnotationMove"
      @annotation-edit-done="onAnnotationEdited"
      @key-pressed="onKeyPressed"
      @annotation-create-start="onCreateStart"
      @annotation-create-move="onCreateMove"
      @annotation-create-done="onCreateDone"
    />
  </div>

</template>

<script setup lang="ts">
import { AnnotatedText, Annotation } from "@/index";
import { textToLines } from "./Utils";

import { annotationsGreek, textGreek as text } from "./data";

import { reactive } from "vue-demi";
import { RenderType } from "@/types/AnnotatedText";
import {
  CreateAnnotationState,
  EditAnnotationState,
} from "@/lib/annotatedTextUtils/StateClasses";

const textLines = textToLines(text);

const annotations: Map<string, Annotation> = annotationsGreek.reduce(
  (map, anno) => {
    map.set(anno.id, { ...anno, visible: true });
    return map;
  },
  new Map()
);

// let annoList = Array.from(annotations.values());

const props = reactive({
  showLabels: false,
  debug: false,
  render: "nested" as RenderType,
  allowEdit: true,
  allowCreate: true,
  reload: true,
  annoList: Array.from(annotations.values()),
});

const onAnnotationClick = function (annotation: Annotation): void {
  console.log("** click received **");
  console.log(annotation);
  if (annotation.class.includes("annotation--active")) {
    annotation.class = annotation.class
      .replace("annotation--active", "")
      .trim();
  } else {
    annotation.class = annotation.class += " annotation--active";
  }
};

const onCreateStart = function (
  createState: CreateAnnotationState
) {
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

const onCreateMove = function (
  createState: CreateAnnotationState
) {
  createState.updateCreating();
};

const onCreateDone = function (
  createState: CreateAnnotationState
) {
  annotations.set(createState.annotation.id, createState.annotation);
  props.annoList = Array.from(annotations.values());
};

const onAnnotationMove = function (
  editState: EditAnnotationState
) {
  editState.newStart = Math.round(editState.newStart / 5) * 5;
  editState.newEnd = Math.round(editState.newEnd / 5) * 5;
  editState.confirmEdit();
};

const onAnnotationEdited = function (
  editState: EditAnnotationState
): void {
  props.debug && console.log("** Edited: ", editState.annotation);
  annotations.set(editState.annotation.id, editState.annotation); // Edit application state
  props.annoList = Array.from(annotations.values());
};

const onKeyPressed = function (
  keyEv: KeyboardEvent,
  editState: EditAnnotationState
): void {
  switch (keyEv.key) {
    case "Escape":
      editState.resetEdit();
      break;
    case "Delete":
      if (editState.editing){
        annotations.delete(editState.annotation.id);
        editState.resetEdit();
      }
      break;
    case "a":
      console.log("a");
      annotations.clear();
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
