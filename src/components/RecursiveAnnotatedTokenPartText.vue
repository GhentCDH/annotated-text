<template>
  <span
    v-if="annotations.length"
    :class="annotationClassHandler(annotations[0], start, end)"
    @click.stop="annotationClickHandler(annotations[0])"
  >
    <RecursiveAnnotatedTokenPartText
      :annotations="annotations.slice(1)"
      :text="text"
      :start="start"
      :end="end"
      :annotation-click-handler="annotationClickHandler"
      :annotation-class-handler="annotationClassHandler"
    />
    <label v-if="annotations[0].label">{{ annotations[0].label }}</label>
  </span>
  <span
    v-else
    _class="annotationClassHandler(annotations[0], start, end)"
    @click.stop="annotationClickHandler(annotations[0])"
    >{{ text }}</span
  >
</template>

<script>
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
      // default: () => [],
      required: false,
    },
    annotationClassHandler: {
      type: Function,
      required: false,
    },
    annotationClickHandler: {
      type: Function,
      required: true,
    },
    activeClass: {
      type: String,
      default: "annotation--active",
    },
    startClass: {
      type: String,
      default: "annotation--start",
    },
    endClass: {
      type: String,
      default: "annotation--end",
    },
  },
  computed: {},
};
</script>

<style scoped lang="scss"></style>
