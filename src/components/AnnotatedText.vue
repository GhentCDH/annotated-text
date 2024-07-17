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
          :allow-edit="allowEdit"
          :allow-create="allowCreate"
          :annotation-classes="annotationClasses"
          :word-part-classes="wordPartClasses"
          :render="render"
          :on-mouse-enter-line-part="onMouseEnterLinePartHandler"
          :on-start-create="onStartCreate"
        />
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { defineEmits } from "vue-demi";
import { AnnotatedTextProps, Annotation, WordPart } from "@/types";
import { createPositionFromPoint } from "@/lib/DomUtils";
import { CssClassesUtil } from "@/lib/annotatedTextUtils/AnnotatedTextUtils";
import AnnotatedLine from "@/components/AnnotatedLine.vue";
import { useStateObjectsStore } from "@/stores/AnnotationComponentStores";
import { storeToRefs } from "pinia";
import AnnotatedLinesUtil from "@/lib/annotatedTextUtils/AnnotatedLinesUtil";
import {
  AnnotationsState,
  CreateAnnotationState,
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
  allowEdit: true,
  allowCreate: true,
  listenToOnEditMove: true,
  listenToOnKeyPressed: true,
  listenToOnCreateStart: true,
  listenToOnCreateMove: true,
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
  "annotation-create-start": [
    annotationsState: AnnotationsState,
    createState: CreateAnnotationState
  ];
  "annotation-create-move": [
    annotationsState: AnnotationsState,
    createState: CreateAnnotationState
  ];
  "annotation-create-done": [
    annotationsState: AnnotationsState,
    createState: CreateAnnotationState
  ];
  "key-pressed": [
    keyEvent: KeyboardEvent,
    annotationsState: AnnotationsState,
    editState: EditAnnotationState
  ];
}>();

const statesStore = useStateObjectsStore();
const { annotationsState, editState, createState } = storeToRefs(statesStore);
annotationsState.value.overrideAnnotations(props.annotations);

const linesUtil = new AnnotatedLinesUtil(
  props,
  annotationsState.value,
  editState.value,
  createState.value
);

// Init util to handle css classes
const cssClassUtil = new CssClassesUtil(props, editState.value);
const annotationGutterClasses = cssClassUtil.annotationGutterClasses;
const annotationClasses = cssClassUtil.annotationClasses;
const componentClasses = cssClassUtil.componentClasses;
const wordPartClasses = cssClassUtil.wordPartClasses;

window.addEventListener("keyup", (keyEv: KeyboardEvent) => {
  if (props.listenToOnKeyPressed) {
    emit("key-pressed", keyEv, annotationsState.value, editState.value);
  } else {
    switch (keyEv.key) {
      case "Escape":
        editState.value.resetEdit();
    }
  }
});

const onClickAnnotation = function (annotation: Annotation) {
  emit("annotation-select", annotation);
};

function onMouseLeaveHandler(e: MouseEvent) {
  if (editState.value.editing) {
    editState.value.resetEdit();
  }
  if (createState.value.creating) {
    createState.value.resetCreating();
  }
}

function onMouseUpHandler(e: MouseEvent) {
  if (editState.value.editing) {
    emit("annotation-edit-done", annotationsState.value, editState.value);
    editState.value.resetEdit();
  } else if (createState.value.creating) {
    emit("annotation-create-done", annotationsState.value, createState.value);
    createState.value.resetCreating();
  }
}

function onMouseEnterLinePartHandler(wordPart: WordPart, e: MouseEvent) {
  const position = createPositionFromPoint(e.x, e.y);
  if (position) {
    const newPosition = wordPart.start + position.offset;
    const offset = newPosition - editState.value.handlePosition;
    if (editState.value.editing) {
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
      if (props.listenToOnEditMove) {
        emit("annotation-edit-moved", annotationsState.value, editState.value);
      } else {
        editState.value.confirmEdit();
      }
    } else if (createState.value.creating) {
      if (createState.value.newStart <= newPosition) {
        createState.value.newEnd = newPosition;
        if (props.listenToOnCreateMove) {
          emit(
            "annotation-create-move",
            annotationsState.value,
            createState.value
          );
        } else {
          createState.value.updateCreating();
        }
      }
    }
  }
}

function onStartCreate(e: MouseEvent, wordPartStart: number) {
  if (props.allowCreate) {
    const position = wordPartStart + createPositionFromPoint(e.x, e.y).offset;
    createState.value.startCreating(position);

    if (props.listenToOnCreateStart) {
      emit(
        "annotation-create-start",
        annotationsState.value,
        createState.value
      );
    } else {
      const annotation: Annotation = {
        id: Math.random().toString().slice(2, 12),
        start: createState.value.newStart,
        end: createState.value.newStart,
        class: "annotation annotation--color-1",
        target: "span",
        active: true,
        visible: true,
      };
      createState.value.initAnnotation(annotation);
    }
  }
}
</script>
