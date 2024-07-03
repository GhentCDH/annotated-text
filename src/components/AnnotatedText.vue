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
        <span
          v-for="word in line.words"
          :key="word.text"
        >
          <span
            v-for="linePart in word.parts"
            :key="linePart.text"
            :class="linePartClasses(linePart)"
            :data-start="linePart.start"
            :data-end="linePart.end"
            @mousemove="onMouseEnterLinePartHandler(linePart)($event)"
          >
            <template v-if="renderFlat">
              <span class="text">{{ linePart.text }}</span>
              <span
                v-for="annotation in linePart.annotations"
                :key="annotation.id"
                :class="
                  annotationClasses(annotation, linePart.start, linePart.end)
                "
                @click="onClickAnnotation(annotation)"
              >
                <label v-if="annotation.label">{{ annotation.label }}</label>
              </span>
            </template>
            <template v-if="renderNested">
              <RecursiveAnnotatedTokenPartText
                v-if="linePart.annotations.length"
                :text="linePart.text"
                :start="linePart.start"
                :end="linePart.end"
                :annotations="
                  linePart.annotations.sort((a, b) => b.weight - a.weight)
                "
                :annotation-class-handler="annotationClasses"
                :annotation-click-handler="onClickAnnotation"
                :annotation-action-handler="onAnnotationStartHandler"
              />
              <span v-else class="text">{{ linePart.text }}</span>
            </template>
          </span>
        </span>

      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed, defineEmits, ref, watch } from "vue-demi";
import type {
  AnnotatedLine,
  AnnotatedTextProps,
  Annotation,
  AnnotationActionPayload,
  AnnotationActionState,
  LinePart
} from "@/types";
import RecursiveAnnotatedTokenPartText from "./RecursiveAnnotatedTokenPartText.vue";
import { caretPositionFromPoint } from "@/lib/DomUtils";
import AnnotatedLinesUtil from "@/lib/annotatedTextUtils/AnnotatedLinesUtil";
import { CssClassesUtil, endsOnLine, startsOnLine } from "@/lib/annotatedTextUtils/AnnotatedTextUtils";

// define emits
const emit = defineEmits<{
  "annotation-select": [annotation: Annotation];
  "annotation-moved": [annotation: Annotation, state: AnnotationActionState];
}>();

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

// state & changes
let state = ref<AnnotationActionState>(initActionState());
let changes = ref({});

const linesUtil = new AnnotatedLinesUtil(props, state, changes);
const annotatedLines = linesUtil.annotatedLines;

const cssClassUtil = new CssClassesUtil(props, state);

const renderNested = computed(() => props.render === "nested");
const renderFlat = computed(() => props.render === "flat");

const annotationGutterClasses = cssClassUtil.annotationGutterClasses;
const annotationClasses = cssClassUtil.annotationClasses;
const componentClasses = cssClassUtil.componentClasses;
const linePartClasses = cssClassUtil.linePartClasses;


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

const onMouseEnterLinePartHandler = (linePart: LinePart) => {
  return function (e: MouseEvent) {
    let position = caretPositionFromPoint(e.x, e.y);
    if (position) {
      // console.log(linePart.start + position.offset);
      // console.log(state.annotation);
      if (state.value.annotation) {
        const newPosition = linePart.start + position.offset;
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
};
</script>
