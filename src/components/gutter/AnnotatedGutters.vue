<template>
  <!-- gutter annotations -->
  <div class="gutter-annotations">
    <template v-for="annotation in gutter?.annotations" :key="annotation">
      <span
        :class="ag(annotation, annotationStyle)"
        :style="{ '--gutter-bg-color': annotation.color?.background }"
        @click="onClick($event, annotation)"
        @dblclick="onDblClick($event, annotation)"
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
import type { Annotation } from "@ghentcdh/vue-component-annotated-text";
import { annotationGutterClasses } from "./annotationGutter.classes";
import type { AnnotatedGutterEmits, AnnotatedGutterProps } from "@/types/props";

withDefaults(defineProps<AnnotatedGutterProps>(), {
  gutter: null,
  annotationStyle: null,
});

const ag = annotationGutterClasses;

const emit = defineEmits<AnnotatedGutterEmits>();

const onClick = (event: MouseEvent, annotation: Annotation) => {
  emit("annotation-click", event, { startOffset: 0, annotation });
};

const onDblClick = (event: MouseEvent, annotation: Annotation) => {
  emit("annotation-double-click", event, { startOffset: 0, annotation });
};
</script>
