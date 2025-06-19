<template>
  <div :id="id"></div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, watch, watchEffect } from "vue";
import { v4 as uuidv4 } from "uuid";
import { Debugger } from "../utils/debugger";
import { AnnotationEvent, AnnotationEventData } from "../compute/events";
import { AnnotationConfig } from "../compute/model/annotation.config";
import { AnnotatedText_ } from "../compute";
import { AnnotatedTextV2Props } from "@/types/props";
import { AnnotatedTextV2Emits } from "@/types/emits";

// init props

const props = withDefaults(defineProps<AnnotatedTextV2Props>(), {
  annotations: () => [],
  selectedAnnotations: () => [],
  hoveredAnnotations: () => [],
  textLines: () => [],
  // annotationOffset: 0,
  debug: false,
  verbose: false,
  allowEdit: false,
  allowCreate: false,
  useSnapper: undefined,
  rtl: false,
});

// define emits
const emit = defineEmits<AnnotatedTextV2Emits>();

const id = `annotated-text-${uuidv4()}`;

const createConfig = (): Partial<AnnotationConfig> => {
  return {
    actions: {
      edit: props.allowEdit ?? false,
      create: props.allowCreate ?? false,
    },
    text: { rtl: props.rtl },
    onEvent: <T extends AnnotationEventData>(event: AnnotationEvent<T>) => {
      emit("event", null, event.event, event.data);
    },
    visualEvent: {
      useSnapper: props.useSnapper,
    },
  } as Partial<AnnotationConfig>;
};

const textAnnotation = AnnotatedText_.init(createConfig());

// get a reference to annotatedTextDraw

onMounted(() => {
  textAnnotation.setLines(props.textLines, false);
  textAnnotation.setAnnotations(props.annotations, false);
  textAnnotation.init(id);
  textAnnotation.highlightAnnotations(props.highlightAnnotations);
  textAnnotation.selectAnnotations(props.selectedAnnotations);
});

watch(
  () => props.textLines,
  () => {
    textAnnotation.setLines(props.textLines);
  },
);

watch(
  () => props.annotations,
  () => {
    textAnnotation.setAnnotations(props.annotations);
  },
  // { immediate: true },
);

watch(
  () => props.rtl,
  () => {
    textAnnotation.changeConfig(createConfig());
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
    textAnnotation.highlightAnnotations(props.highlightAnnotations);
  },
);

watch(
  () => props.selectedAnnotations,
  () => {
    textAnnotation.selectAnnotations(props.selectedAnnotations);
  },
);

watch(
  () => props.allowEdit,
  () => {
    textAnnotation.changeConfig(createConfig());
  },
);
watch(
  () => props.allowCreate,
  () => {
    textAnnotation.changeConfig(createConfig());
  },
);

watch(
  () => props.rtl,
  () => {
    textAnnotation.changeConfig(createConfig());
  },
);

onUnmounted(() => {
  textAnnotation.destroy();
});
</script>
