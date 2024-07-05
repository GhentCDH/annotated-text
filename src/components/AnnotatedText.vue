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
        />
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { defineEmits, watch } from "vue-demi";
import { AnnotatedTextProps, Annotation, AnnotationActionState } from "@/types";
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
  "annotation-moved": [annotation: Annotation, state: AnnotationActionState];
}>();

// Init store
const store = useAnnotationsStore();
store.init(props);
const { annotationsState, changes } = storeToRefs(store);
const annotatedLines = store.annotatedLines;

// Init util to handle css classes
const cssClassUtil = new CssClassesUtil(props, annotationsState);
const annotationGutterClasses = cssClassUtil.annotationGutterClasses;
const annotationClasses = cssClassUtil.annotationClasses;
const componentClasses = cssClassUtil.componentClasses;
const wordPartClasses = cssClassUtil.wordPartClasses;

// clear changes on prop update
// (parent had the change to listen to events)
watch(
  () => props,
  (_newValue, _oldValue) => {
    changes.value = {};
  }
);

const onClickAnnotation = function (annotation: Annotation) {
  emit("annotation-select", annotation);
  console.log("emit click-annotation");
};

function onMouseUpHandler(e: MouseEvent) {
  // reset state?
  if (annotationsState.value.action) {
    emit(
      "annotation-moved",
      JSON.parse(JSON.stringify(annotationsState.value.annotation)),
      annotationsState.value
    );
    store.initActionState();
  }
  console.log("global mouseup");
  console.log(e);
  const pos = createPositionFromPoint(e.x, e.y);
  console.log(`${pos.offset}`);
}
</script>
