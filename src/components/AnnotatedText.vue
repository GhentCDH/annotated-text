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
          :component-id="props.componentId"
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
import { defineEmits, reactive, watchEffect } from "vue-demi";
import { AnnotatedTextProps, Annotation, WordPart } from "@/types";
import { createPositionFromPoint } from "@/lib/DomUtils";
import { CssClassesUtil } from "@/lib/annotatedTextUtils/AnnotatedTextUtils";
import AnnotatedLine from "@/components/AnnotatedLine.vue";
import { useStateObjectsStore } from "@/stores/AnnotationComponentStores";
import { storeToRefs } from "pinia";
import AnnotatedLinesUtil from "@/lib/annotatedTextUtils/AnnotatedLinesUtil";
import {
  CreateAnnotationState,
  UpdateAnnotationState,
} from "@/lib/annotatedTextUtils/StateClasses";
import { v4 as uuidv4 } from "uuid";

// init props
let props = withDefaults(defineProps<AnnotatedTextProps>(), {
  annotations: () => [],
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

props = reactive(props);

watchEffect(() => {
  props.annotations.values();
});

// define emits
const emit = defineEmits<{
  "annotation-select": [annotation: Annotation];

  "annotation-updating": [updateState: UpdateAnnotationState];
  "annotation-update-end": [updateState: UpdateAnnotationState];
  "annotation-create-start": [createState: CreateAnnotationState];
  "annotation-creating": [createState: CreateAnnotationState];
  "annotation-create-end": [createState: CreateAnnotationState];
  "key-pressed": [keyEvent: KeyboardEvent, updateState: UpdateAnnotationState];
}>();

const statesStore = useStateObjectsStore(props.componentId);
const { updateState, createState } = storeToRefs(statesStore());

const linesUtil = new AnnotatedLinesUtil(
  props,
  updateState.value,
  createState.value
);

// Init util to handle css classes
const cssClassUtil = new CssClassesUtil(props, updateState.value);
const annotationGutterClasses = cssClassUtil.annotationGutterClasses;
const annotationClasses = cssClassUtil.annotationClasses;
const componentClasses = cssClassUtil.componentClasses;
const wordPartClasses = cssClassUtil.wordPartClasses;

window.addEventListener("keyup", (keyEv: KeyboardEvent) => {
  if (props.listenToOnKeyPressed) {
    emit("key-pressed", keyEv, updateState.value);
  } else {
    switch (keyEv.key) {
      case "Escape":
        updateState.value.resetUpdate();
    }
  }
});

const onClickAnnotation = function (annotation: Annotation) {
  emit("annotation-select", annotation);
};

function onMouseLeaveHandler(e: MouseEvent) {
  if (updateState.value.editing) {
    updateState.value.resetUpdate();
  }
  if (createState.value.creating) {
    createState.value.resetCreating();
  }
}

function onMouseUpHandler(e: MouseEvent) {
  if (updateState.value.editing) {
    emit("annotation-update-end", updateState.value);
    updateState.value.resetUpdate();
  } else if (createState.value.creating) {
    emit("annotation-create-end", createState.value);
    createState.value.resetCreating();
  }
}

function onMouseEnterLinePartHandler(wordPart: WordPart, e: MouseEvent) {
  const position = createPositionFromPoint(e.x, e.y);
  if (position) {
    const newPosition = wordPart.start + position.offset;
    const offset = newPosition - updateState.value.handlePosition;
    if (updateState.value.editing) {
      updateState.value.newStart = updateState.value.annotation.start;
      updateState.value.newEnd = updateState.value.annotation.end;
      switch (updateState.value.action) {
        case "moveEnd":
          if (newPosition >= updateState.value.annotation.start) {
            updateState.value.newEnd = newPosition;
          }
          break;
        case "moveStart":
          if (newPosition <= updateState.value.annotation.end) {
            updateState.value.newStart = newPosition;
          }
          break;
        case "move":
          updateState.value.newStart = updateState.value.origStart + offset;
          updateState.value.newEnd = updateState.value.origEnd + offset;
          break;
      }
      if (props.listenToOnEditMove) {
        emit("annotation-updating", updateState.value);
      } else {
        updateState.value.confirmUpdate();
      }
    } else if (createState.value.creating) {
      if (createState.value.newStart <= newPosition) {
        createState.value.newEnd = newPosition;
        if (props.listenToOnCreateMove) {
          emit("annotation-creating", createState.value);
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
      emit("annotation-create-start", createState.value);
    } else {
      const annotation: Annotation = {
        id: uuidv4(),
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
