<template>
  <span v-for="word in line.words" :key="word.text">
    <span
      v-for="wordPart in word.parts"
      :key="wordPart.text"
      :class="wordPartClasses(wordPart)"
      :data-start="wordPart.start"
      :data-end="wordPart.end"
      @mousemove="onMouseMove(wordPart, $event)"
      @mouseleave="onMouseLeave"
    >
      <template v-if="renderFlat">
        <span class="text">{{ wordPart.text }}</span>
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
          @click="onClickAnnotation(annotation)"
        >
          <label v-if="annotation.label">{{ annotation.label }}</label>
        </span>
      </template>
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
          :annotations="
            wordPart.annotations.sort((a, b) => b.weight - a.weight)
          "
          :annotation-class-handler="annotationClasses"
          :annotation-click-handler="onClickAnnotation"
          :on-update-start="onUpdateStart"
        >
          <template v-slot:annotation-start>
            <slot name="annotation-start"></slot>
          </template>
          <template v-slot:annotation-end>
            <slot name="annotation-end"></slot>
          </template>

        </RecursiveAnnotatedTokenPartText>
        <span
          v-else
          :class="handleTextClass()"
          @mousedown="onStartCreate($event, wordPart.start)"
        >
          {{ wordPart.text }}
        </span>
      </template>
    </span>
  </span>
</template>

<script setup lang="ts">
import RecursiveAnnotatedTokenPartText from "@/components/RecursiveAnnotatedTokenPartText.vue";
import { AnnotatedLineProps } from "@/types";
import { computed } from "vue-demi";
import { useStateObjectsStore } from "@/stores/AnnotationComponentStores";
import { storeToRefs } from "pinia";

const props = withDefaults(defineProps<AnnotatedLineProps>(), {
  render: "nested",
  wordPartClasses: () => [],
  annotationClasses: () => [],
});

const statesStore = useStateObjectsStore(props.componentId);
const { hoverState } = storeToRefs(statesStore());

// When leaving the line remove all annotations of that line from the hovered annos
function onMouseLeave(e: MouseEvent) {
  const annotations = [];
  props.line.words.forEach((w) => {
    w.parts.forEach((wp) => {
      annotations.push(wp.annotations);
    });
  });
  hoverState.value.hoveredAnnotations =
    hoverState.value.hoveredAnnotations.filter((a) =>
      annotations.some((a2) => a.id === a2.id)
    );
}

const renderNested = computed(() => props.render === "nested");
const renderFlat = computed(() => props.render === "flat");

function handleTextClass(): string[] {
  const res = ["text"];
  if (props.allowCreate) {
    res.push("create-anno-text");
  }
  return res;
}
</script>

<style scoped lang="scss"></style>
