<template>
  <span
    v-if="annotations.length"
    :class="annotationClassHandler(annotation, start, end)"
    @click.stop="annotationClickHandler(annotation)"
    @mousedown="onActionStart($event, 'move')"
  >
    <span
      v-if="start === annotation?.start"
      class="handle handle--start"
      @mousedown.stop="onActionStart($event, 'moveStart')"
    ></span>
    <RecursiveAnnotatedTokenPartText
      :annotations="annotations.slice(1)"
      :text="text"
      :start="start"
      :end="end"
      :allow-edit="allowEdit"
      :word-part-start="wordPartStart"
      :annotation-click-handler="annotationClickHandler"
      :annotation-class-handler="annotationClassHandler"
    />
    <label v-if="annotations[0].label">{{ annotations[0].label }}</label>
    <span
      v-if="end === annotations[0]?.end"
      class="handle handle--end"
      @mousedown.stop="onActionStart($event, 'moveEnd')"
    ></span>
  </span>
  <span v-else class="text">{{ text }}</span>
</template>

<script setup lang="ts">
import { createPositionFromPoint } from "@/lib/DomUtils";
import { RecursiveAnnotatedTokenPartTextProps } from "@/types";
import { computed } from "vue-demi";
import { ActionType } from "@/types/AnnotatedText";
import { useStateObjectsStore } from "@/stores/AnnotationComponentStores";
import { storeToRefs } from "pinia";

const props = withDefaults(
  defineProps<RecursiveAnnotatedTokenPartTextProps>(),
  {
    annotations: () => [],
    annotationClassHandler: () => [],
  }
);

// store
const statesStore = useStateObjectsStore();
const { editState, annotationsState } = storeToRefs(statesStore);

const annotation = computed(() => props.annotations[0]);

const annotationClickHandler = props.annotationClickHandler;
const annotationClassHandler = props.annotationClassHandler;

function onActionStart(e: MouseEvent, action: ActionType) {
  if (props.allowEdit) {
    const position = createPositionFromPoint(e.x, e.y);
    editState.value.startEditing(
      action,
      props.wordPartStart + position.offset,
      this.annotation,
      this.annotation.end,
      this.annotation.start,
      this.annotation.end,
      this.annotation.start
    );
  }
}
</script>

<style scoped lang="scss"></style>
