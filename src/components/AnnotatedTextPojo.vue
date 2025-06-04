<template>
  <div class="pojo" :id="id"></div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, watch, watchEffect } from "vue";
import { v4 as uuidv4 } from "uuid"; // init props
import { Debugger } from "../utils/debugger";
import { ComputeAnnotations } from "../compute/compute_annotations";
import { AnnotationEvent } from "../compute/events";
import { AnnotationConfig } from "../compute/model/annotation.config";
import { AnnotatedTextPojoProps } from "@/types/props";
import { AnnotatedTextPojoEmits } from "@/types/emits";

// init props

const props = withDefaults(defineProps<AnnotatedTextPojoProps>(), {
  annotations: () => [],
  selectedAnnotations: () => [],
  hoveredAnnotations: () => [],
  textLines: () => [],
  // annotationOffset: 0,
  debug: false,
  verbose: false,
  allowEdit: false,
  allowCreate: false,
});

// define emits
const emit = defineEmits<AnnotatedTextPojoEmits>();

const id = `annotated-text-${uuidv4()}`;

const createConfig = (): Partial<AnnotationConfig> => {
  return {
    actions: {
      edit: props.allowEdit ?? false,
      create: props.allowCreate ?? false,
    },
    onEvent: (event: AnnotationEvent) => {
      emit("event", null, event.event, event.data);
    },
  };
};

const computeAnnotations = new ComputeAnnotations(
  props.textLines,
  createConfig(),
);

// get a reference to annotatedTextDraw

onMounted(() => {
  computeAnnotations.setAnnotations(props.annotations, false);
  computeAnnotations.init(id);
});

watch(
  () => props.textLines,
  () => {
    computeAnnotations.setLines(props.textLines);
  },
);

watch(
  () => props.annotations,
  () => {
    computeAnnotations.setAnnotations(props.annotations);
  },
  // { immediate: true },
);

watchEffect(() => {
  Debugger.setDebug(props.debug);
  Debugger.setVerbose(props.verbose);
});

watch(
  () => props.highlightAnnotations,
  () => {
    computeAnnotations.highlightAnnotations(props.highlightAnnotations);
  },
  { immediate: true },
);

watch(
  () => props.selectedAnnotations,
  () => {
    computeAnnotations.selectAnnotations(props.selectedAnnotations);
  },
  { immediate: true },
);

watch(
  () => props.allowEdit,
  () => {
    computeAnnotations.changeConfig(createConfig());
  },
);
watch(
  () => props.allowCreate,
  () => {
    computeAnnotations.changeConfig(createConfig());
  },
);

onUnmounted(() => {
  computeAnnotations.destroy();
});
</script>
