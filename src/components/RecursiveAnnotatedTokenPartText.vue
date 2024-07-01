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
      :annotation-click-handler="annotationClickHandler"
      :annotation-class-handler="annotationClassHandler"
      :annotation-action-handler="annotationActionHandler"
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

<script lang="ts">
import { caretPositionFromPoint } from "@/lib/DomUtils";
import { Annotation } from "@/types";

export default {
  name: "RecursiveAnnotatedTokenPartText",
  props: {
    text: {
      type: String,
      required: true,
    },
    start: {
      type: Number,
      required: true,
    },
    end: {
      type: Number,
      required: true,
    },
    annotations: {
      type: Array,
      default: () => [],
      required: false,
    },
    annotationClassHandler: {
      type: Function,
      default: () => {},
      required: false,
    },
    annotationClickHandler: {
      type: Function,
      required: true,
    },
    annotationActionHandler: {
      type: Function,
      required: true,
    },
  },
  computed: {
    annotation(): Annotation {
      return this.annotations[0];
    },
  },
  methods: {
    onActionStart(e: MouseEvent, action) {
      const position = caretPositionFromPoint(e.x, e.y);
      this.annotationActionHandler(e, {
        annotation: this.annotation,
        action: action,
        handlePosition: this.annotation.start + position.offset,
      });
    },
  },
};
</script>

<style scoped lang="scss"></style>
