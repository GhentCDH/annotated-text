<template>
  <span v-for="word in line.words" :key="word.text">
    <span
      v-for="wordPart in word.parts"
      :key="wordPart.text"
      :class="wordPartClasses(wordPart)"
      :data-start="wordPart.start"
      :data-end="wordPart.end"
      @mousemove.once="store.onMouseEnterLinePartHandler(wordPart, $event)"
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
          :word-part-start="wordPart.start"
          :annotations="
            wordPart.annotations.sort((a, b) => b.weight - a.weight)
          "
          :annotation-class-handler="annotationClasses"
          :annotation-click-handler="onClickAnnotation"
        />
        <span
          v-else
          class="text"
          @mousedown="(e) => onSelectStart(e, wordPart.start)"
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
import { useAnnotationsStore } from "@/stores/AnnotationsStore";
import { createPositionFromPoint } from "@/lib/DomUtils";

const props = withDefaults(defineProps<AnnotatedLineProps>(), {
  render: "nested",
  wordPartClasses: () => [],
  annotationClasses: () => [],
});

const store = useAnnotationsStore();

const renderNested = computed(() => props.render === "nested");
const renderFlat = computed(() => props.render === "flat");

function onSelectStart(e: MouseEvent, wordStart: number) {
  console.log("select start");
  console.log(e);
  const pos = createPositionFromPoint(e.x, e.y).offset + wordStart;
  console.log(pos);
  store.onStartSelect(pos);
}
</script>

<style scoped lang="scss"></style>
