<template>
  <!-- gutter annotations -->
  <div class="gutter-annotations">
    <template v-for="annotation in gutter?.annotations" :key="annotation">
      <span
        :class="ag(annotation, annotationStyle)"
        :style="{ '--gutter-bg-color': annotation.color?.background }"
        @click="
          props.mouseDownHandler($event, {
            startOffset: 0,
            annotation,
          })
        "
      >
        <label v-if="annotation.label">{{ annotation.label }}</label>
      </span>
    </template>
  </div>
  <!-- gutter text -->
  <div v-if="gutter" class="gutter text">
    {{ gutter?.text }}
  </div>
</template>

<script setup lang="ts">
import { annotationGutterClasses } from "./annotationGutter.classes";
import type { AnnotatedGutterProps } from "@/types/props";

const props = withDefaults(defineProps<AnnotatedGutterProps>(), {
  gutter: null,
  annotationStyle: null,
  mouseDownHandler: () => {},
});

const ag = annotationGutterClasses;
</script>
