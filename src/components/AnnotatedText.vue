<template>
  <div
    v-if="linesUtil.annotatedLines.value.length"
    :class="componentClasses"
    @mouseleave="onMouseLeave($event)"
    @mouseup="onMouseUp($event)"
  >
    <template v-for="line in linesUtil.annotatedLines.value" :key="line">
      <!-- gutter annotations -->
      <div class="gutter-annotations">
        <template
          v-for="annotation in line.gutter.annotations"
          :key="annotation"
        >
          <span
            :class="annotationGutterClasses(annotation, line)"
            @click="
              onMouseDown($event, { startOffset: 0, annotation: annotation })
            "
          >
            <label v-if="annotation.label">{{ annotation.label }}</label>
          </span>
        </template>
      </div>
      <!-- gutter text -->
      <div v-if="line?.gutter" class="gutter text">
        {{ line?.gutter?.text }}
      </div>
      <!-- line -->
      <div class="content">
        <AnnotatedLine
          :component-id="props.componentId"
          :line="line"
          :allow-edit="allowEdit"
          :allow-create="allowCreate"
          :annotation-classes="annotationClasses"
          :word-part-classes="wordPartClasses"
          :render="render"
          :mouse-down-handler="onMouseDown"
          :mouse-move-handler="onMouseMove"
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
        </AnnotatedLine>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive } from "vue";
import { AnnotatedTextProps, Annotation, WordPart } from "@/types";
import { createPositionFromPoint } from "@/lib/DomUtils";
import { CssClassesUtil } from "@/lib/annotatedTextUtils/AnnotatedTextUtils";
import AnnotatedLine from "@/components/AnnotatedLine.vue";
import { useStateObjectsStore } from "@/stores/AnnotationComponentStores";
import { storeToRefs } from "pinia";
import AnnotatedLinesUtil from "@/lib/annotatedTextUtils/AnnotatedLinesUtil";
import { UserActionState } from "@/lib/annotatedTextUtils/StateClasses";
import { v4 as uuidv4 } from "uuid";
import { ActionType } from "@/types/AnnotatedText";
import { watch } from "vue";
import { AnnotatedTextEmits } from "@/types/Emits";
import { MouseEventPayload } from "@/types/Props";

// init props
/**
 * @ignore
 */
let props = withDefaults(defineProps<AnnotatedTextProps>(), {
  annotations: () => [],
  selectedAnnotations: () => [],
  hoveredAnnotations: () => [],
  lines: () => [],
  annotationOffset: 0,
  debug: false,
  verbose: false,
  theme: "default",
  render: "nested",
  display: "span",
  showLabels: false,
  autoAnnotationWeights: true,
  allowEdit: true,
  allowCreate: true,
  listenToOnUpdateStart: false,
  listenToOnUpdating: false,
  listenToOnKeyPressed: false,
  listenToOnCreateStart: false,
  listenToOnCreating: false,
  style: () => ({
    activeClass: "annotation--active",
    startClass: "annotation--start",
    endClass: "annotation--end",
    weightClass: "annotation--weight-",
    transitioningClass: "annotation--transitioning",
    shadowClass: "annotation--shadow",
    hoveredClass: "annotation--hover",
  }),
});

props = reactive(props);

// define emits
const emit = defineEmits<AnnotatedTextEmits>();

const statesStore = useStateObjectsStore(props.componentId);
const { updateState, createState, userState, hoverState } = storeToRefs(
  statesStore()
);

const userStateLabel = computed(() => userState.value.state);

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

/* user state event */
watch(userStateLabel, (nv, ov) => {
  props.verbose && console.log("user-action-state-change", ov, nv);
  emit("user-action-state-change", ov, nv);
});

/* keyboard events */
window.addEventListener("keyup", (keyEv: KeyboardEvent) => {
  if (props.listenToOnKeyPressed) {
    props.verbose &&
      console.log("key-pressed", keyEv.key, updateState.value, createState.value);
    emit(
      "key-pressed",
      keyEv,
      updateState.value,
      createState.value,
      userState.value
    );
  } else {
    switch (keyEv.key) {
      case "Escape":
        updateState.value.resetUpdate();
    }
  }
});

/* mouse event handlers */
const onMouseDownHandlers = new Map<
  UserActionState,
  (e: MouseEvent, payload?: MouseEventPayload) => void
>();
const onMouseUpHandlers = new Map<UserActionState, (e: MouseEvent) => void>();
const onMouseMoveHandlers = new Map<
  UserActionState,
  (e: MouseEvent, payload?: MouseEventPayload) => void
>();

function onMouseDown(e: MouseEvent, payload?: MouseEventPayload) {
  props.verbose && console.log('@onMouseDown', 'userState:', userState.value.state, payload)
  onMouseDownHandlers.get(userState.value.state) &&
    onMouseDownHandlers.get(userState.value.state)(e, payload);
}

function onMouseMove(e: MouseEvent, payload?: MouseEventPayload) {
  props.verbose && console.log('@onMouseMove', 'userState:', e, userState.value.state, payload, payload?.annotation?.id)
  onMouseMoveHandlers.get(userState.value.state) &&
    onMouseMoveHandlers.get(userState.value.state)(e, payload);
}

function onMouseUp(e: MouseEvent) {
  props.verbose && console.log('@onMouseUp', 'userState:', userState.value.state)
  onMouseUpHandlers.get(userState.value.state) &&
    onMouseUpHandlers.get(userState.value.state)(e);
}

function onMouseLeave(e: MouseEvent, payload?: MouseEventPayload) {
  props.verbose && console.log('@onMouseLeave', 'userState:', userState.value.state)
  if (updateState.value.updating) {
    updateState.value.resetUpdate();
  }
  if (createState.value.creating) {
    createState.value.resetCreating();
  }
}

onMouseDownHandlers.set(
  UserActionState.IDLE,
  (e: MouseEvent, payload?: MouseEventPayload) => {
    if (payload?.annotation) {
      userState.value.state = UserActionState.START_SELECT;
      userState.value.payload = payload;
      return;
    }
    if (payload?.startOffset) {
      userState.value.state = UserActionState.START_CREATE;
      userState.value.payload = payload;
      return;
    }
  }
);

onMouseUpHandlers.set(UserActionState.START_SELECT, (e: MouseEvent) => {
  // emit select event
  props.verbose && console.log("annotation-select", userState.value.payload.annotation);
  emit("annotation-select", userState.value.payload.annotation, e);
  // reset user state
  userState.value.reset();
});

onMouseUpHandlers.set(UserActionState.START_CREATE, (e: MouseEvent) => {
  // reset user state
  userState.value.reset();
});

// Annotation CREATION events

// USER STATE start_create + MOUSE EVENT move => USER STATE creating (if allowed)
onMouseMoveHandlers.set(
  UserActionState.START_CREATE,
  (e: MouseEvent, payload?: MouseEventPayload) => {
    if (props.allowCreate) {
      const position = payload.startOffset + createPositionFromPoint(e.x, e.y).offset;
      createState.value.startCreating(position);

      if (props.listenToOnCreateStart) {
        props.verbose && console.log("*emit annotation-create-begin", createState.value);
        emit("annotation-create-begin", createState.value);
      } else {
        const annotation: Annotation = {
          id: uuidv4(),
          start: createState.value.newStart,
          end: createState.value.newStart,
          class: "annotation annotation--color-1",
          target: "span",
        };
        createState.value.initAnnotation(annotation);
      }

      // update user state
      userState.value.state = UserActionState.CREATING;
    }
  }
);

// USER STATE creating + MOUSE EVENT mousemove => continue creating, update positions
onMouseMoveHandlers.set(
  UserActionState.CREATING,
  (e: MouseEvent, payload?: MouseEventPayload) => {
    const position = createPositionFromPoint(e.x, e.y);
    if (position) {
      const newPosition = payload.startOffset + position.offset;
      if (createState.value.newStart <= newPosition) {
        createState.value.newEnd = newPosition;
        if (props.listenToOnCreating) {
          props.verbose && console.log("*emit annotation-creating", createState.value);
          emit("annotation-creating", createState.value);
        } else {
          createState.value.updateCreating();
        }
      }
    }
  }
);

// USER STATE creating + MOUSE EVENT mouseup
onMouseUpHandlers.set(UserActionState.CREATING, (e: MouseEvent) => {
  props.verbose && console.log("*emit annotation-create-end", createState.value);
  emit("annotation-create-end", createState.value);
  createState.value.resetCreating();
});

// Annotation UPDATE events

// start_select state + mouse move event => updating
onMouseMoveHandlers.set(
  UserActionState.START_SELECT,
  (e: MouseEvent, payload?: MouseEventPayload) => {
    // is allowed to edit?
    if (!props.allowEdit) {
      return;
    }
    // get current char position
    const position = createPositionFromPoint(e.x, e.y);
    if (!position) {
      return;
    }

    // init update state
    updateState.value.startUpdating(
      userState.value.payload.action,
      userState.value.payload.startOffset + position.offset,
      userState.value.payload.annotation,
      userState.value.payload.annotation.end,
      userState.value.payload.annotation.start,
      userState.value.payload.annotation.end,
      userState.value.payload.annotation.start
    );

    // confirm update state
    if (props.listenToOnUpdateStart) {
      props.verbose && console.log("*emit annotation-update-begin", updateState.value);
      emit("annotation-update-begin", updateState.value);
    } else {
      updateState.value.confirmStartUpdating();
    }
  }
);

// updating state + mouse move event => keep updating
onMouseMoveHandlers.set(
  UserActionState.UPDATING,
  (e: MouseEvent, payload: MouseEventPayload) => {
    const position = createPositionFromPoint(e.x, e.y);
    let isUpdated: boolean = false;
    if (position) {
      // calculate new annotation position
      const newPosition = payload.startOffset + position.offset;
      const offset = newPosition - updateState.value.handlePosition;
      updateState.value.newStart = updateState.value.annotation.start;
      updateState.value.newEnd = updateState.value.annotation.end;
      switch (updateState.value.action) {
        case "moveEnd":
          if (newPosition >= updateState.value.annotation.start) {
            updateState.value.newEnd = newPosition;
            isUpdated = true;
          }
          break;
        case "moveStart":
          if (newPosition <= updateState.value.annotation.end) {
            updateState.value.newStart = newPosition;
            isUpdated = true;
          }
          break;
        default:
        case "move":
          if (updateState.value.newStart != updateState.value.origStart + offset) {
            updateState.value.newStart = updateState.value.origStart + offset;
            updateState.value.newEnd = updateState.value.origEnd + offset;
            isUpdated = true;
          }
          break;
      }
      // postion updated?
      if (isUpdated) {
        // needs confirmation by user?
        if (props.listenToOnUpdating) {
          props.verbose && console.log("*emit annotation-updating", updateState.value);
          emit("annotation-updating", updateState.value);
        } else {
          updateState.value.confirmUpdate();
        }
      }
    }
  }
);

// updating state + mouse up event => end updating
onMouseUpHandlers.set(UserActionState.UPDATING, (e: MouseEvent) => {
  props.verbose && console.log("*emit annotation-update-end", updateState.value);
  emit("annotation-update-end", updateState.value);
  updateState.value.resetUpdate();
});

// Annotation HOVER events
onMouseMoveHandlers.set(
  UserActionState.IDLE,
  (e: MouseEvent, payload?: MouseEventPayload) => {
    // over annotation?
    if (payload?.annotation) {
      const annotation: Annotation = payload.annotation;
      if (
        !hoverState.value.hoveredAnnotations.some((a) => a.id === annotation.id)
      ) {
        hoverState.value.hoveredAnnotations.push(annotation);
        props.verbose && console.log("annotation-mouse-over", annotation.id);
        emit("annotation-mouse-over", annotation, e);
      }
    } else {
      hoverState.value.hoveredAnnotations.map((annotation: Annotation) => {
        props.verbose && console.log("annotation-mouse-leave", annotation.id);
        emit("annotation-mouse-leave", annotation, e);
      });
      hoverState.value.hoveredAnnotations = [];
    }
  }
);
</script>
