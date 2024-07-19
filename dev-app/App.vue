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
      @annotation-updating="onAnnotationUpdating"
      @annotation-update-end="onAnnotationUpdateEnd"
      @key-pressed="onKeyPressed"
      @annotation-create-start="onAnnotationCreateStart"
      @annotation-creating="onAnnotationCreating"
      @annotation-create-end="onAnnotationCreateEnd"
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
import { AnnotatedText, Annotation } from "@/index";
import { textToLines } from "./Utils";

import { annotationsGreek, textGreek as text } from "./data";

import { reactive } from "vue-demi";
import { RenderType } from "@/types/AnnotatedText";
import {
  CreateAnnotationState,
  UpdateAnnotationState,
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

const onAnnotationUpdating = function (updateState: UpdateAnnotationState) {
  updateState.newStart = Math.round(updateState.newStart / 5) * 5;
  updateState.newEnd = Math.round(updateState.newEnd / 5) * 5;
  updateState.confirmUpdate();
};

const onAnnotationUpdateEnd = function (updateState: UpdateAnnotationState): void {
  props.debug && console.log("** Edited: ", updateState.annotation);
  annotations.set(updateState.annotation.id, updateState.annotation); // Edit application state
  props.annoList = Array.from(annotations.values());
};

const onKeyPressed = function (
  keyEv: KeyboardEvent,
  updateState: UpdateAnnotationState
): void {
  switch (keyEv.key) {
    case "Escape":
      updateState.resetUpdate();
      break;
    case "Delete":
      if (updateState.editing) {
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
