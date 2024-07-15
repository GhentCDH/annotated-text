<template>
  <div
    v-if="linesUtil.annotatedLines"
    :class="componentClasses"
    @mouseleave="onMouseLeaveHandler($event)"
    @mouseup="onMouseUpHandler($event)"
  >
    <template v-for="line in linesUtil.annotatedLines.value" :key="line">
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
import {
  useEditAnnotationsStore,
  useStateObjectsStore,
} from "@/stores/AnnotationComponentStores";
import { storeToRefs } from "pinia";
import AnnotatedLinesUtil from "@/lib/annotatedTextUtils/AnnotatedLinesUtil";
import {
  AnnotationsState,
  EditAnnotationState,
} from "@/lib/annotatedTextUtils/StateClasses";

// init props
const props = withDefaults(defineProps<AnnotatedTextProps>(), {
  annotations: () => new Map(),
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
    shadowClass: "annotation--shadow",
  }),
});

// define emits
const emit = defineEmits<{
  "annotation-select": [annotation: Annotation];
  "annotation-edit-done": [
    annotationsState: AnnotationsState,
    editState: EditAnnotationState
  ];
  "annotation-edit-moved": [
    annotationsState: AnnotationsState,
    editState: EditAnnotationState
  ];
  "key-pressed": [
    keyEvent: KeyboardEvent,
    annotationsState: AnnotationsState,
    editState: EditAnnotationState
  ];
}>();

const statesStore = useStateObjectsStore();
statesStore.init();
const { annotationsState, editState } = storeToRefs(statesStore);
annotationsState.value.overrideAnnotations(props.annotations);

const linesUtil = new AnnotatedLinesUtil(
  props,
  annotationsState.value,
  editState.value
);

// Init util to handle css classes
const cssClassUtil = new CssClassesUtil(props, editState.value);
const annotationGutterClasses = cssClassUtil.annotationGutterClasses;
const annotationClasses = cssClassUtil.annotationClasses;
const componentClasses = cssClassUtil.componentClasses;
const wordPartClasses = cssClassUtil.wordPartClasses;

window.addEventListener("keyup", (keyEv: KeyboardEvent) => {
  emit("key-pressed", keyEv, annotationsState.value, editState.value);
});

const onClickAnnotation = function (annotation: Annotation) {
  emit("annotation-select", annotation);
  console.log("emit click-annotation");
};

function onMouseLeaveHandler(e: MouseEvent) {
  // reset state?
  if (editState.value.action) {
    editState.value.resetEdit();
  }
  console.log("global mouseleave");
}

function onMouseUpHandler(e: MouseEvent) {
  // reset state?
  if (editState.value.action) {
    emit("annotation-edit-done", annotationsState.value, editState.value);
    editState.value.resetEdit();
  }
}

function onMouseEnterLinePartHandler(wordPart: WordPart, e: MouseEvent) {
  const position = createPositionFromPoint(e.x, e.y);
  if (position) {
    if (editState.value.annotation) {
      const newPosition = wordPart.start + position.offset;
      const offset = newPosition - editState.value.handlePosition;
      editState.value.newStart = editState.value.annotation.start;
      editState.value.newEnd = editState.value.annotation.end;
      switch (editState.value.action) {
        case "moveEnd":
          if (newPosition >= editState.value.annotation.start) {
            editState.value.newEnd = newPosition;
          }
          break;
        case "moveStart":
          if (newPosition <= editState.value.annotation.end) {
            editState.value.newStart = newPosition;
          }
          break;
        case "move":
          editState.value.newStart = editState.value.origStart + offset;
          editState.value.newEnd = editState.value.origEnd + offset;
          break;
      }
      emit("annotation-edit-moved", annotationsState.value, editState.value);
    }
  }
}
</script>
