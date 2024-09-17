<template>
  <span v-for="word in line.words" :key="word.text" class="token">
    <span
      v-for="wordPart in word.parts"
      :key="wordPart.text"
      :class="wordPartClasses(wordPart)"
      @mousemove="
        props.mouseMoveHandler($event, {
          startOffset: wordPart.start,
        })
      "
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
              props.allowCreate
            )
          "
          @mousedown="
            props.mouseDownHandler($event, {
              startOffset: wordPart.start,
              annotation: annotation,
              action: 'move',
            })
          "
          @mousemove="
            props.mouseMoveHandler($event, {
              startOffset: wordPart.start,
              annotation: annotation,
            })
          "
        >
          <label v-if="annotation.label">{{ annotation.label }}</label>
        </span>
      </template>
      <!-- render nested ? -->
      <template v-if="renderNested">
        <RecursiveAnnotatedTokenPartText
          v-if="wordPart.annotations.length"
          :component-id="props.componentId"
          :text="wordPart.text"
          :start="wordPart.start"
          :end="wordPart.end"
          :allow-edit="allowEdit"
          :allow-create="allowCreate"
          :word-part-start="wordPart.start"
          :annotations="sortAnnotations(wordPart.annotations)"
          :annotation-class-handler="annotationClasses"

          :mouse-down-handler="props.mouseDownHandler"
          :mouse-move-handler="props.mouseMoveHandler"
        >
          <template #annotation-before="slotProps">
            <slot name="annotation-before" :annotation="slotProps.annotation" />
          </template>
          <template #annotation-after="slotProps">
            <slot name="annotation-after" :annotation="slotProps.annotation" />
          </template>
        </RecursiveAnnotatedTokenPartText>
        <span
          v-else
          :class="handleTextClass()"
          @mousedown="props.mouseDownHandler($event, { startOffset: wordPart.start })"
        >
          {{ wordPart.text }}
        </span>
      </template>
    </span>
  </span>
</template>

<script setup lang="ts">
import RecursiveAnnotatedTokenPartText from "@/components/RecursiveAnnotatedTokenPartText.vue";
import { AnnotatedLineProps, Annotation } from "@/types";
import { computed } from "vue-demi";

const props = withDefaults(defineProps<AnnotatedLineProps>(), {
  render: "nested",
  wordPartClasses: () => [],
  annotationClasses: () => [],
});

const renderNested = computed(() => props.render === "nested");
const renderFlat = computed(() => props.render === "flat");

function handleTextClass(): string[] {
  const res = ["text"];
  if (props.allowCreate) {
    res.push("create-anno-text");
  }
  return res;
}

function sortAnnotations(annotations: Annotation[]): Annotation[] {
  return annotations.sort((a, b) => b.weight - a.weight);
}
</script>

<style scoped lang="scss"></style>
