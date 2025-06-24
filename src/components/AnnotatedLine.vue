<template>
  <span v-for="word in line.words" :key="word.text" class="token">
    <span
      v-for="wordPart in word.parts"
      :key="wordPart.text"
      :class="[
        'token-segment',
        `token-segment--m${wordPart.maxAnnotationWeight}`,
      ]"
      @mousemove="mouseMove($event, wordPart)"
    >
      <!-- render flat ? -->
      <template v-if="renderFlat">
        <!-- output text -->
        <span class="text">{{ wordPart.text }}</span>
        <!-- output annotations below text -->
        <span
          v-for="annotation in wordPart.annotations"
          :key="annotation.id"
          :class="
            annotationClasses(
              annotation,
              wordPart.start,
              wordPart.end,
              allowCreate,
            )
          "
          :style="annotationStyle(annotation.color)"
          @mousedown="mouseDown($event, wordPart, annotation, 'move')"
          @mousemove="mouseMove($event, wordPart, annotation)"
          @dblclick="doubleClick($event, wordPart, annotation)"
        >
          <label v-if="annotation.label">{{ annotation.label }}</label>
        </span>
      </template>
      <!-- render nested ? -->
      <template v-if="renderNested">
        <RecursiveAnnotatedTokenPartText
          v-if="wordPart.annotations.length"
          :text="wordPart.text"
          :start="wordPart.start"
          :end="wordPart.end"
          :allow-edit="allowEdit"
          :allow-create="allowCreate"
          :word-part-start="wordPart.start"
          :annotations="sortAnnotations(wordPart.annotations)"
          :annotation-class-handler="annotationClasses"
          @annotation-click="onClick"
          @annotation-double-click="onDoubleClick"
          @annotation-mouse-move="onMove"
        >
          <template #annotation-before="slotProps">
            <slot name="annotation-before" :annotation="slotProps.annotation" />
          </template>
          <template #annotation-after="slotProps">
            <slot name="annotation-after" :annotation="slotProps.annotation" />
          </template>
        </RecursiveAnnotatedTokenPartText>
        <TextOnly
          v-else
          :word-part="wordPart"
          :allow-create="allowCreate"
          @annotation-click="onClick"
          @annotation-double-click="onDoubleClick"
        />
      </template>
    </span>
  </span>
</template>

<script setup lang="ts">
import { computed } from "vue";
import RecursiveAnnotatedTokenPartText from "./RecursiveAnnotatedTokenPartText.vue";
import TextOnly from "./text/TextOnly.vue";
import type { Annotation } from "../model";

import type { ActionType, WordPart } from "../types/AnnotatedText";
import { annotationStyle } from "../utils/annotatedTextUtils/AnnotatedTextUtils/annotation.style";
import { AnnotationInternal } from "../types/Annotation";
import type { AnnotatedLineEmits, AnnotatedLineProps } from "@/types/props";

const props = withDefaults(defineProps<AnnotatedLineProps>(), {
  render: "nested",
  annotationClasses: () => [],
});

const renderNested = computed(() => props.render === "nested");
const renderFlat = computed(() => props.render === "flat");

function sortAnnotations(
  annotations: AnnotationInternal[],
): AnnotationInternal[] {
  return annotations.sort((a, b) => b.weight - a.weight);
}

const emit = defineEmits<AnnotatedLineEmits>();

const mouseDown = (
  event: MouseEvent,
  wordPart: WordPart,
  annotation?: Annotation,
  action?: ActionType,
) => {
  onClick(event, {
    startOffset: wordPart?.start,
    annotation,
    action,
  });
};

const doubleClick = (
  event: MouseEvent,
  wordPart: WordPart,
  annotation?: Annotation,
  action?: ActionType,
) => {
  onDoubleClick(event, {
    startOffset: wordPart?.start,
    annotation,
    action,
  });
};

const mouseMove = (
  event: MouseEvent,
  wordPart: WordPart,
  annotation?: Annotation,
) => {
  onMove(event, {
    startOffset: wordPart?.start,
    annotation,
  });
};

const onClick = (event: MouseEvent, payload: any) => {
  emit("annotation-click", event, payload);
};
const onDoubleClick = (event: MouseEvent, payload: any) => {
  emit("annotation-double-click", event, payload);
};
const onMove = (event: MouseEvent, payload: any) => {
  emit("annotation-mouse-move", event, payload);
};
</script>

<style scoped lang="scss"></style>
