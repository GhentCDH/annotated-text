<template>
  <span v-for="word in line.words" :key="word.text">
    <span
      v-for="wordPart in word.parts"
      :key="wordPart.text"
      :class="wordPartClasses(wordPart)"
      :data-start="wordPart.start"
      :data-end="wordPart.end"
      @mousemove="onMouseEnterLinePartHandler(wordPart, $event)"
    >
      <template v-if="renderFlat">
        <span class="text">{{ wordPart.text }}</span>
        <span
          v-for="annotation in wordPart.annotations"
          :key="annotation.id"
          :class="annotationClasses(annotation, wordPart.start, wordPart.end)"
          @click="onClickAnnotation(annotation)"
        >
          <label v-if="annotation.label">{{ annotation.label }}</label>
        </span>
      </template>
      <template v-if="renderNested">
        <RecursiveAnnotatedTokenPartText
          v-if="wordPart.annotations.length"
          :text="wordPart.text"
          :start="wordPart.start"
          :end="wordPart.end"
          :annotations="
            wordPart.annotations.sort((a, b) => b.weight - a.weight)
          "
          :annotation-class-handler="annotationClasses"
          :annotation-click-handler="onClickAnnotation"
          :annotation-action-handler="onAnnotationStartHandler"
        />
        <span v-else class="text">{{ wordPart.text }}</span>
      </template>
    </span>
  </span>
</template>

<script setup lang="ts">
import RecursiveAnnotatedTokenPartText from "@/components/RecursiveAnnotatedTokenPartText.vue";
import {
  AnnotatedLine,
  Annotation,
  AnnotationActionPayload,
  WordPart,
} from "@/types";
import { computed } from "vue-demi";
import { RenderType } from "@/types/AnnotatedText";

export interface AnnotatedLineProps {
  line: AnnotatedLine;
  wordPartClasses?: (wordPart: WordPart) => any[];
  render?: RenderType;
  annotationClasses?: (
    annotation: Annotation,
    start: number,
    end: number
  ) => string[];
  onMouseEnterLinePartHandler: (
    wordPart: WordPart,
    mouseEvent: MouseEvent
  ) => void;
  onClickAnnotation: (annotation: Annotation) => void;
  onAnnotationStartHandler: (
    mouseEvent: MouseEvent,
    payload: AnnotationActionPayload
  ) => void;
}

const props = withDefaults(defineProps<AnnotatedLineProps>(), {
  render: "nested",
  wordPartClasses: () => [],
  annotationClasses: () => [],
});

const renderNested = computed(() => props.render === "nested");
const renderFlat = computed(() => props.render === "flat");
</script>

<style scoped lang="scss"></style>
