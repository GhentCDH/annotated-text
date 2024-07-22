<template>
  <span
    v-if="annotations.length"
    :class="annotationClassHandler(annotation, start, end, props.allowCreate)"
    @click.stop="annotationClickHandler(annotation)"
    @mousedown="onUpdateStart($event, 'move', wordPartStart, annotation)"
  >
    <span
      v-if="start === annotation?.start"
      class="handle handle--start"
      @mousedown.stop="
        onUpdateStart($event, 'moveStart', wordPartStart, annotation)
      "
    ></span>
    <RecursiveAnnotatedTokenPartText
      :component-id="componentId"
      :annotations="annotations.slice(1)"
      :text="text"
      :start="start"
      :end="end"
      :allow-edit="allowEdit"
      :word-part-start="wordPartStart"
      :annotation-click-handler="annotationClickHandler"
      :annotation-class-handler="annotationClassHandler"
      :on-update-start="onUpdateStart"
    />
    <label v-if="annotations[0].label">{{ annotations[0].label }}</label>
    <span
      v-if="end === annotations[0]?.end"
      class="handle handle--end"
      @mousedown.stop="
        onUpdateStart($event, 'moveEnd', wordPartStart, annotation)
      "
    ></span>
  </span>
  <span v-else class="text">{{ text }}</span>
</template>

<script setup lang="ts">
import { RecursiveAnnotatedTokenPartTextProps } from "@/types";
import { computed } from "vue-demi";

const props = withDefaults(
  defineProps<RecursiveAnnotatedTokenPartTextProps>(),
  {
    annotations: () => [],
    annotationClassHandler: () => [],
  }
);

const annotation = computed(() => props.annotations[0]);

const annotationClickHandler = props.annotationClickHandler;
const annotationClassHandler = props.annotationClassHandler;
</script>

<style scoped lang="scss"></style>
