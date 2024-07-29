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
            @click="onClickAnnotation(annotation, $event)"
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
          :on-mouse-move="onMouseMove"
          :on-start-create="onStartCreate"
          :on-update-start="onUpdateStart"
        >
          <template #annotation-start="slotProps">
            <slot
              name="annotation-start"
              :annotation="slotProps.annotation"
            ></slot>
          </template>
          <template #annotation-end="slotProps">
            <slot name="annotation-end" :annotation="slotProps.annotation" />
          </template>
        </AnnotatedLine>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed, defineEmits, reactive } from "vue-demi";
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
  UserActionState,
} from "@/lib/annotatedTextUtils/StateClasses";
import { v4 as uuidv4 } from "uuid";
import { ActionType } from "@/types/AnnotatedText";
import { watch } from "vue";

// init props
let props = withDefaults(defineProps<AnnotatedTextProps>(), {
  annotations: () => [],
  selectedAnnotations: () => [],
  hoveredAnnotations: () => [],
  lines: () => [],
  annotationOffset: 0,
  debug: true,
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
const emit = defineEmits<{
  /**
   * Emitted when an annotation (both span and gutter) is clicked.
   * @arg annotation {Annotation} Annotation object that was clicked
   * @arg mouseEvent {MouseEvent} normal dom mouse event
   */
  "annotation-select": [annotation: Annotation, mouseEvent: MouseEvent];
  /**
   * Emitted when the user starts updating an annotation, so when the mouse is
   * clicked down and the listenToOnUpdateStart prop is true.
   *
   * The newStart and newEnd fields of the updateState can be edited.
   *
   * updateState.confirmStartUpdating should be called in order to confirm
   * the start of the update
   * @arg updateState UpdateAnnotationState object
   */
  "annotation-update-start": [updateState: UpdateAnnotationState];
  /**
   * Emitted every time the user moves their cursor while updating an
   * annotation. Only emitted if the listenToOnUpdating prop is true.
   *
   * The newStart and newEnd fields of the updateState can be edited.
   *
   * updateState.confirmUpdate should be called in order to confirm the new
   * position after the mouse move.
   * @arg updateState UpdateAnnotationState object
   */
  "annotation-updating": [updateState: UpdateAnnotationState];
  /**
   *
   */
  "annotation-update-end": [updateState: UpdateAnnotationState];
  "annotation-create-start": [createState: CreateAnnotationState];
  "annotation-creating": [createState: CreateAnnotationState];
  "annotation-create-end": [createState: CreateAnnotationState];
  "key-pressed": [keyEvent: KeyboardEvent, updateState: UpdateAnnotationState];
  "annotation-mouse-over": [
    hoveredAnnotations: Annotation[],
    mouseEvent: MouseEvent
  ];
  "annotation-mouse-leave": [
    hoveredAnnotations: Annotation[],
    mouseEvent: MouseEvent
  ];
  "user-action-state-change": [
    oldState: UserActionState,
    newState: UserActionState
  ];
}>();

const statesStore = useStateObjectsStore(props.componentId);
const { updateState, createState, userState, hoverState } = storeToRefs(
  statesStore()
);

const userStateComp = computed(() => userState.value.value);

watch(userStateComp, (nv, ov) => {
  emit("user-action-state-change", ov, nv);
});

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

const onClickAnnotation = function (
  annotation: Annotation,
  mouseEvent: MouseEvent
) {
  if (userState.value.value === UserActionState.IDLE) {
    emit("annotation-select", annotation, mouseEvent);
  }
};

function onMouseLeaveHandler(e: MouseEvent) {
  if (updateState.value.updating) {
    updateState.value.resetUpdate();
  }
  if (createState.value.creating) {
    createState.value.resetCreating();
  }
}

function onMouseUpHandler(e: MouseEvent) {
  if (updateState.value.updating) {
    emit("annotation-update-end", updateState.value);
    updateState.value.resetUpdate();
  } else if (createState.value.creating) {
    emit("annotation-create-end", createState.value);
    createState.value.resetCreating();
  }
}

const onMouseMoveHandlerFunctions = new Map<
  UserActionState,
  (wordPart: WordPart, e: MouseEvent) => void
>();

onMouseMoveHandlerFunctions.set(
  UserActionState.UPDATING,
  (wordPart: WordPart, e: MouseEvent) => {
    const position = createPositionFromPoint(e.x, e.y);
    if (position) {
      const newPosition = wordPart.start + position.offset;
      const offset = newPosition - updateState.value.handlePosition;
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
      if (props.listenToOnUpdating) {
        emit("annotation-updating", updateState.value);
      } else {
        updateState.value.confirmUpdate();
      }
    }
  }
);

onMouseMoveHandlerFunctions.set(
  UserActionState.IDLE,
  (wordPart: WordPart, e: MouseEvent) => {
    hoverState.value.hoveredAnnotations = wordPart.annotations;
    hoverState.value.mouseEvent = e;
  }
);

const hoverStateComp = computed(() => hoverState.value.hoveredAnnotations);

watch(hoverStateComp, (nv, ov) => {
  const removedObjects = ov.filter(
    (oldObj) => !nv.some((newObj) => newObj.id === oldObj.id)
  );
  const addedObjects: Annotation[] = nv.filter(
    (newObj) => !ov.some((oldObj) => oldObj.id === newObj.id)
  );

  if (addedObjects.length > 0) {
    emit(
      "annotation-mouse-over",
      addedObjects,
      hoverState.value.mouseEvent as MouseEvent
    );
  }

  if (removedObjects.length > 0) {
    emit(
      "annotation-mouse-leave",
      removedObjects,
      hoverState.value.mouseEvent as MouseEvent
    );
  }
});

onMouseMoveHandlerFunctions.set(
  UserActionState.CREATING,
  (wordPart: WordPart, e: MouseEvent) => {
    const position = createPositionFromPoint(e.x, e.y);
    if (position) {
      const newPosition = wordPart.start + position.offset;
      if (createState.value.newStart <= newPosition) {
        createState.value.newEnd = newPosition;
        if (props.listenToOnCreating) {
          emit("annotation-creating", createState.value);
        } else {
          createState.value.updateCreating();
        }
      }
    }
  }
);

function onMouseMove(wordPart: WordPart, e: MouseEvent) {
  onMouseMoveHandlerFunctions.get(userState.value.value)(wordPart, e);
}

function onUpdateStart(
  e: MouseEvent,
  action: ActionType,
  wordPartStart: number,
  annotation: Annotation
) {
  if (props.allowEdit && userState.value.value === UserActionState.IDLE) {
    userState.value.value = UserActionState.UPDATING;
    const position = createPositionFromPoint(e.x, e.y);
    updateState.value.startUpdating(
      action,
      wordPartStart + position.offset,
      annotation,
      annotation.end,
      annotation.start,
      annotation.end,
      annotation.start
    );
    if (props.listenToOnUpdateStart) {
      emit("annotation-update-start", updateState.value);
    } else {
      updateState.value.confirmStartUpdating();
    }
  }
}

function onStartCreate(e: MouseEvent, wordPartStart: number) {
  if (props.allowCreate && userState.value.value === UserActionState.IDLE) {
    userState.value.value = UserActionState.CREATING;
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
