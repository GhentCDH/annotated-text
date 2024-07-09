<template>
  <div
    v-if="annotatedLines"
    :class="componentClasses"
    @mouseleave="store.onMouseLeaveHandler($event)"
    @mouseup="onMouseUpHandler($event)"
  >
    <template v-for="line in store.annotatedLines" :key="line">
      <div class="gutter-annotations">
        <template
          v-for="annotation in line.gutter.annotations"
          :key="annotation"
        >
          <span
            :class="annotationGutterClasses(annotation, line)"
            @click="onClickAnnotation(annotation)"
          >
            <label v-if="annotation.label">{{ annotation.label }}</label>
          </span>
        </template>
      </div>

      <div v-if="line?.gutter" class="gutter text">
        {{ line?.gutter?.text }}
      </div>

      <div class="content">
        <AnnotatedLine
          :on-click-annotation="onClickAnnotation"
          :line="line"
          :annotation-classes="annotationClasses"
          :word-part-classes="wordPartClasses"
          :render="render"
          :on-mouse-enter-line-part="onMouseEnterLinePartHandler"
        />
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { defineEmits, watch } from "vue-demi";
import {
  AnnotatedTextProps,
  Annotation,
  AnnotationActionState,
  WordPart,
} from "@/types";
import { createPositionFromPoint } from "@/lib/DomUtils";
import { CssClassesUtil } from "@/lib/annotatedTextUtils/AnnotatedTextUtils";
import AnnotatedLine from "@/components/AnnotatedLine.vue";
import { useAnnotationsStore } from "@/stores/AnnotationsStore";
import { storeToRefs } from "pinia";

// init props
const props = withDefaults(defineProps<AnnotatedTextProps>(), {
  annotations: () => [],
  lines: () => [],
  annotationOffset: 0,
  debug: true,
  theme: "default",
  render: "nested",
  showLabels: false,
  autoAnnotationWeights: true,
  allowEdit: false,
  style: () => ({
    activeClass: "annotation--active",
    startClass: "annotation--start",
    endClass: "annotation--end",
    weightClass: "annotation--weight-",
    transitioningClass: "annotation--transitioning",
  }),
});

// define emits
const emit = defineEmits<{
  "annotation-select": [annotation: Annotation];
  "annotation-edited": [annotation: Annotation];
}>();

// Init store
const store = useAnnotationsStore();
store.init(props);
const { annotationsState, createAnnotationState } = storeToRefs(store);
const annotatedLines = store.annotatedLines;

// Init util to handle css classes
const cssClassUtil = new CssClassesUtil(props, annotationsState);
const annotationGutterClasses = cssClassUtil.annotationGutterClasses;
const annotationClasses = cssClassUtil.annotationClasses;
const componentClasses = cssClassUtil.componentClasses;
const wordPartClasses = cssClassUtil.wordPartClasses;

const onClickAnnotation = function (annotation: Annotation) {
  emit("annotation-select", annotation);
  console.log("emit click-annotation");
};

function onMouseUpHandler(e: MouseEvent) {
  // reset state?
  if (annotationsState.value.action) {
    emit(
      "annotation-edited",
      JSON.parse(JSON.stringify(annotationsState.value.annotation))
    );
    store.initActionState();
  } else if (createAnnotationState.value.start) {
    console.log("select end");
    console.log(e);
    const length = window.getSelection().toString().length - 1;
    console.log(length);
    store.onEndSelect(length, window.getSelection().toString());
    store.initCreateState();
  }
}

function onMouseEnterLinePartHandler(wordPart: WordPart, e: MouseEvent) {
  const position = createPositionFromPoint(e.x, e.y);
  if (position) {
    if (annotationsState.value.annotation) {
      const newPosition = wordPart.start + position.offset;
      const offset = newPosition - annotationsState.value.handlePosition;
      switch (annotationsState.value.action) {
        case "moveEnd":
          if (newPosition >= annotationsState.value.annotation.start) {
            annotationsState.value.newEnd = newPosition;
            annotationsState.value.annotation.end = newPosition;
          }
          break;
        case "moveStart":
          if (newPosition <= annotationsState.value.annotation.end) {
            annotationsState.value.newStart = newPosition;
            annotationsState.value.annotation.start = newPosition;
          }
          break;
        case "move":
          annotationsState.value.newStart =
            annotationsState.value.origStart + offset;
          annotationsState.value.newEnd =
            annotationsState.value.origEnd + offset;
          annotationsState.value.annotation.start =
            annotationsState.value.origStart + offset;
          annotationsState.value.annotation.end =
            annotationsState.value.origEnd + offset;
          break;
      }
      emit("annotation-edited", annotationsState.value.annotation);
    }
  }
}
</script>
