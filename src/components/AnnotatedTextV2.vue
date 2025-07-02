<template>
  <div :id="id"></div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, watch, watchEffect } from "vue";
import { v4 as uuidv4 } from "uuid";
import type { Annotation, CreateAnnotations } from "../core";
import { createAnnotatedText, Debugger, TextLineAdapter } from "../core";
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

let textAnnotation: CreateAnnotations<Annotation>;

// get a reference to annotatedTextDraw

const createText = () => {
  textAnnotation?.destroy();
  textAnnotation = createAnnotatedText(id, {
    text: TextLineAdapter({ textDirection: props.rtl ? "rtl" : "ltr" }),
    annotation: {
      edit: props.allowEdit,
      create: props.allowCreate,
      snapper: props.useSnapper,
    },
  })
    .setText(props.text, false)
    .setAnnotations(props.annotations)
    .highlightAnnotations(props.highlightAnnotations)
    .selectAnnotations(props.selectedAnnotations)
    .on("all", (event) =>
      emit("event", event.mouseEvent, event.event, event.data),
    );
};

onMounted(() => {
  createText();
});

watch(
  () => props.text,
  () => {
    textAnnotation?.setText(props.text);
  },
);

watch(
  () => props.annotations,
  () => {
    textAnnotation?.setAnnotations(props.annotations);
  },
  // { immediate: true },
);

watch(
  () => props.rtl,
  () => {
    createText();
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
    textAnnotation?.highlightAnnotations(props.highlightAnnotations);
  },
);

watch(
  () => props.selectedAnnotations,
  () => {
    textAnnotation?.selectAnnotations(props.selectedAnnotations);
  },
);

watch(
  () => props.allowEdit,
  () => {
    textAnnotation?.changeAnnotationAdapterConfig("edit", props.allowEdit);
  },
);
watch(
  () => props.allowCreate,
  () => {
    textAnnotation?.changeAnnotationAdapterConfig("create", props.allowCreate);
  },
);

watch(
  () => props.rtl,
  () => {
    textAnnotation.changeTextAdapterConfig(
      "textDirection",
      props.rtl ? "rtl" : "ltr",
    );
  },
);

onUnmounted(() => {
  textAnnotation?.destroy();
});
</script>
