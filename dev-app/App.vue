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
    </form>
  </menu>

  <hr />

  <AnnotatedText
    text="012345678901234567890123456789"
    :annotations="annotations"
    :lines="textLines"
    :debug="props.debug"
    :show-labels="props.showLabels"
    :render="props.render"
    key="text"
    @annotation-select="onAnnotationClick"
    @annotation-edited="onAnnotationEdited"
    @select-text="onSelectText"
  />
</template>

<script setup lang="ts">
import { AnnotatedText, Annotation } from "@/index";
import { textToLines } from "./Utils";

import { annotationsGreek, textGreek as text } from "./data";

import { computed, reactive } from "vue-demi";
import { RenderType } from "@/types/AnnotatedText";
import { AnnotationsState, EditAnnotationState } from "@/lib/annotatedTextUtils/StateClasses";

const textLines = textToLines(text);

const props = reactive({
  showLabels: false,
  debug: false,
  render: "nested" as RenderType,
});

const annotations: Map<string, Annotation> = annotationsGreek.reduce(
  (map, anno) => {
    map.set(anno.id, { ...anno, visible: true });
    return map;
  },
  new Map()
);

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

const onAnnotationEdited = function (annotationsState: AnnotationsState, editState: EditAnnotationState): void {
  props.debug && console.log("** Edited: ", editState.annotation);
  annotationsState.editAnnotation(editState.annotation); // Edit component state
  annotations.set(editState.annotation.id, editState.annotation); // Edit application state
};

function onSelectText(start: number, end: number, text: string){
  console.log(`selected from ${start} until ${end}`);
  const id = Math.random().toString().slice(2, 12);
  const anno: Annotation = {
    id: id,
    start: start,
    end: end,
    text: text,
    label: "label",
    target: "span",
    visible: true,
    class: "annotation annotation--color-6",
  };
  annotations.set(id, anno);
  console.log(annotations);
}
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
</style>
