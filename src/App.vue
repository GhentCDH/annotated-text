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
    @click-annotation="onClick"
    @_mousemove="onMouseOver"
  />
</template>

<script setup lang="ts">
import { AnnotatedText, Annotation, Line } from "./";

import { annotationsTest as annotations, textTest as text } from "./lib/data";

import { reactive } from "vue-demi";
import { RenderType } from "./types/AnnotatedText";

const textToLines = (text: string): Line[] => {
  const regLineNumber = /^([0-9/]+[a-z]?)\./g;
  let lineStart = 0;
  let lineEnd = 0;
  let gutter = "";

  // split text into lines
  let lines = text.split("\n");
  let lineObjects = [] satisfies Line[];

  // split lines into line number, text, start and end
  for (let i = 0; i < lines.length; i++) {
    lineEnd = lineStart + (lines[i].length - 1);
    gutter = lines[i].match(regLineNumber)
      ? lines[i].match(regLineNumber)[0]
      : "";
    lineObjects[i] = {
      gutter: gutter,
      text: lines[i].replace(regLineNumber, ""),
      start: lineStart + gutter.length,
      end: lineEnd,
    };
    lineStart = lineEnd + 2;

    //empty lines:
    lineObjects[i].end = Math.max(lineObjects[i].end, lineObjects[i].start);
  }
  console.log("line objects", lineObjects);
  return lineObjects;
};

const textLines = textToLines(text);

const props = reactive({
  showLabels: false,
  debug: false,
  render: "nested" as RenderType,
});

const onClick = function (annotation: Annotation): void {
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

const onMouseOver = function (event): void {
  console.log(caretPositionFromPoint(event.clientX, event.clientY));
};

function caretPositionFromPoint(
  x: number,
  y: number
): {
  offsetNode: Node;
  offset: number;
  getClientRect(): ClientRect | DOMRect;
} | null {
  // @ts-ignore
  if (document.caretPositionFromPoint) {
    // @ts-ignore
    let position = document.caretPositionFromPoint(x, y);
    return position
      ? {
          offsetNode: position.offsetNode,
          offset: position.offset,
          getClientRect() {
            return position.getClientRect();
          },
        }
      : null;
  } else {
    let range = document.caretRangeFromPoint(x, y);
    return range
      ? {
          offsetNode: range.startContainer,
          offset: range.startOffset,
          getClientRect() {
            return range.getClientRects()[0];
          },
        }
      : null;
  }
}

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
