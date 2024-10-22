<template>
  <span
    :class="{
      text: true,
      'create-anno-text': allowCreate,
    }"
    @dblclick="doubleClick($event, wordPart)"
    @mousedown="mouseDown($event, wordPart)"
  >
    {{ wordPart.text }}
  </span>
</template>

<script setup lang="ts">
import type { WordPart } from "../../types/AnnotatedText";
import type { MouseEventEmitPayload } from "@/types/props";

type TextOnlyProps = {
  wordPart: WordPart;
  allowCreate: boolean;
};

withDefaults(defineProps<TextOnlyProps>(), {
  text: "",
  allowCreate: false,
});

export type TextOnlyEmits = {
  "annotation-click": MouseEventEmitPayload;
  "annotation-double-click": MouseEventEmitPayload;
};
const emit = defineEmits<TextOnlyEmits>();

const mouseDown = (event: MouseEvent, wordPart: WordPart) => {
  emit("annotation-click", event, {
    startOffset: wordPart?.start,
  });
};

const doubleClick = (event: MouseEvent, wordPart: WordPart) => {
  emit("annotation-double-click", event, {
    startOffset: wordPart?.start,
  });
};
</script>
