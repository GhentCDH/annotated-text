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
    @annotation-select="onAnnotationClick"
    @annotation-moved="onAnnotationMoved"
  />
</template>

<script setup lang="ts">
import { AnnotatedText, Annotation, Line } from "@/index";
import { textToLines } from "./Utils";

import { annotationsGreek, textGreek as text } from "./data";

import { reactive } from "vue-demi";
import { RenderType } from "@/types/AnnotatedText";

const textLines = textToLines(text);

const props = reactive({
  showLabels: false,
  debug: true,
  render: "nested" as RenderType,
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

const onAnnotationMoved = function (annotation: Annotation): void {
  console.log("** moved: ", annotation);
};

const annotations: Annotation[] = annotationsGreek;

// console.log(textLines);
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
