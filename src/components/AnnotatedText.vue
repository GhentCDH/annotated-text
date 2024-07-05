<template>
  <div
    v-if="annotatedLines"
    :class="componentClasses"
    @mouseleave="onMouseLeaveHandler($event)"
    @mouseup="onMouseUpHandler($event)"
  >
    <template v-for="line in annotatedLines" :key="line">
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
          :on-annotation-start-handler="onAnnotationStartHandler"
          :on-mouse-enter-line-part-handler="onMouseEnterLinePartHandler"
          :annotation-classes="annotationClasses"
          :word-part-classes="wordPartClasses"
          :render="render"
        />
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed, defineEmits, ref, watch } from "vue-demi";
import {
  Annotation,
  AnnotationActionPayload,
  AnnotationActionState,
  AnnotationStyle,
  Line,
  WordPart,
} from "@/types";
import { createPositionFromPoint } from "@/lib/DomUtils";
import AnnotatedLinesUtil from "@/lib/annotatedTextUtils/AnnotatedLinesUtil";
import { CssClassesUtil } from "@/lib/annotatedTextUtils/AnnotatedTextUtils";
import AnnotatedLine from "@/components/AnnotatedLine.vue";
import { RenderType } from "@/types/AnnotatedText";

export interface AnnotatedTextProps {
  text?: string;
  annotations?: Annotation[];
  lines: Line[];
  annotationOffset?: number;
  debug?: boolean;
  theme?: string;
  render?: RenderType;
  showLabels?: boolean;
  autoAnnotationWeights?: boolean;
  style?: AnnotationStyle;
  allowEdit?: boolean;
}

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

// state & changes
let state = ref<AnnotationActionState>(initActionState());
let changes = ref({});

const linesUtil = new AnnotatedLinesUtil(props, state, changes);
const annotatedLines = linesUtil.annotatedLines;

const cssClassUtil = new CssClassesUtil(props, state);

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

function initActionState(): AnnotationActionState {
  return {
    action: null,
    handlePosition: null,
    annotation: null,
    origEnd: null,
    origStart: null,
    newEnd: null,
    newStart: null,
  };
}

const onClickAnnotation = function (annotation: Annotation) {
  emit("annotation-select", annotation);
  console.log("emit click-annotation");
};

function onMouseLeaveHandler(e: MouseEvent) {
  // reset state?
  if (state.value.action) {
    state.value = initActionState();
  }
  console.log("global mouseleave");
}

function onMouseUpHandler(e: MouseEvent) {
  // reset state?
  if (state.value.action) {
    emit(
      "annotation-moved",
      JSON.parse(JSON.stringify(state.value.annotation)),
      state.value
    );
    state.value = initActionState();
  }
  console.log("global mouseup");
  console.log(e);
  const pos = createPositionFromPoint(e.x, e.y);
  console.log(`${pos.offset}`);
}

function onAnnotationStartHandler(
  e: MouseEvent,
  payload: AnnotationActionPayload
) {
  console.log(`start resize (${payload.action})`);
  state.value = {
    ...payload,
    origStart: payload.annotation.start,
    origEnd: payload.annotation.end,
    newStart: payload.annotation.start,
    newEnd: payload.annotation.end,
  };
}

const onMouseEnterLinePartHandler = (wordPart: WordPart, e: MouseEvent) => {
  let position = createPositionFromPoint(e.x, e.y);
  if (position) {
    // console.log(wordPart.start + position.offset);
    // console.log(state.annotation);
    if (state.value.annotation) {
      const newPosition = wordPart.start + position.offset;
      const offset = newPosition - state.value.handlePosition;
      switch (state.value.action) {
        case "moveEnd":
          if (newPosition >= state.value.annotation.start) {
            state.value.newEnd = newPosition;
            changes.value[state.value.annotation.id] = {
              start: state.value.newStart,
              end: state.value.newEnd,
            };
          }
          break;
        case "moveStart":
          if (newPosition <= state.value.annotation.end) {
            state.value.newStart = newPosition;
            changes.value[state.value.annotation.id] = {
              start: state.value.newStart,
              end: state.value.newEnd,
            };
          }
          break;
        case "move":
          state.value.newStart = state.value.origStart + offset;
          state.value.newEnd = state.value.origEnd + offset;
          changes.value[state.value.annotation.id] = {
            start: state.value.newStart,
            end: state.value.newEnd,
          };
          break;
      }
    }
  }
};

</script>
