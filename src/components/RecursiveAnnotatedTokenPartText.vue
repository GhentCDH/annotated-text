<template>
  <!-- slot: annotation-before -->
  <span
    v-if="start === annotation?.start"
    class="annotation-slot annotation-slot--before"
  >
    <slot name="annotation-before" :annotation="annotation" />
  </span>
  <!-- output annotation -->
  <span
    v-if="annotations.length"
    :class="
      props.annotationClassHandler(annotation, start, end, props.allowCreate)
    "
    @mousedown.stop="
      props.mouseDownHandler($event, {
        startOffset: wordPartStart,
        annotation: annotation,
        action: 'move',
      })
    "
    @mousemove.stop="
      props.mouseMoveHandler($event, {
        startOffset: wordPartStart,
        annotation: annotation,
      })
    "
  >
    <!-- handle: move annotation start -->
    <span
      v-if="start === annotation?.start"
      class="handle handle--start"
      @mousedown.stop="
        props.mouseDownHandler($event, {
          startOffset: wordPartStart,
          annotation: annotation,
          action: 'moveStart',
        })
      "
    ></span>
    <!-- recurse annotation list -->
    <RecursiveAnnotatedTokenPartText
      :annotations="annotations.slice(1)"
      :text="text"
      :start="start"
      :end="end"
      :allow-edit="allowEdit"
      :word-part-start="wordPartStart"
      :annotation-class-handler="props.annotationClassHandler"
      :mouse-down-handler="props.mouseDownHandler"
      :mouse-move-handler="props.mouseMoveHandler"
    >
      <template #annotation-before="slotProps">
        <slot
          name="annotation-before"
          :annotation="slotProps.annotation"
        ></slot>
      </template>
      <template #annotation-after="slotProps">
        <slot name="annotation-after" :annotation="slotProps.annotation" />
      </template>
    </RecursiveAnnotatedTokenPartText>
    <!-- annotation label -->
    <label v-if="annotations[0].label">{{ annotations[0].label }}</label>
    <!-- handle: move annotation end -->
    <span
      v-if="end === annotations[0]?.end"
      class="handle handle--end"
      @mousedown.stop="
        props.mouseDownHandler($event, {
          startOffset: wordPartStart,
          annotation: annotation,
          action: 'moveEnd',
        })
      "
    ></span>
  </span>
  <span v-else class="text">{{ text }}</span>
  <!-- slot: annotation-after -->
  <span
    v-if="end === annotation?.end"
    class="annotation-slot annotation-slot--after"
  >
    <slot name="annotation-after" :annotation="annotation" />
  </span>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { RecursiveAnnotatedTokenPartTextProps } from "@/types/props";

const props = withDefaults(
  defineProps<RecursiveAnnotatedTokenPartTextProps>(),
  {
    annotations: () => [],
    annotationClassHandler: () => [],
  }
);

const annotation = computed(() => props.annotations[0]);
</script>

<style scoped lang="scss"></style>
