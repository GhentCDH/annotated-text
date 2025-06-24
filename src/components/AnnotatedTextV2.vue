<template>
  <div :id="id"></div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, watch, watchEffect } from "vue";
import { v4 as uuidv4 } from "uuid";
import { Debugger } from "../utils/debugger";
import { AnnotationConfig } from "../compute/model/annotation.config";
import { createAnnotatedText } from "../compute";
import { CreateAnnotations } from "../compute/CreateAnnotations";
import { Annotation } from "../types/Annotation";
import { Line } from "../types/AnnotatedText";
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
    visualEvent: {
      useSnapper: props.useSnapper,
    },
  } as Partial<AnnotationConfig>;
};

let textAnnotation: CreateAnnotations<Line, Annotation>;

// get a reference to annotatedTextDraw

const createText = () => {
  textAnnotation?.destroy();
  textAnnotation = createAnnotatedText(
    id,
    {
      line: { textDirection: props.rtl ? "rtl" : "ltr" },
      annotation: {
        edit: props.allowEdit,
        create: props.allowCreate,
        // useSnapper: props.useSnapper,
      },
    },
    createConfig(),
  )
    .setLines(props.textLines, false)
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
  () => props.textLines,
  () => {
    textAnnotation?.setLines(props.textLines);
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
    textAnnotation?.annotationAdapter.enableEdit(props.allowEdit);
  },
);
watch(
  () => props.allowCreate,
  () => {
    textAnnotation?.annotationAdapter.enableCreate(props.allowCreate);
  },
);

watch(
  () => props.rtl,
  () => {
    textAnnotation?.lineAdapter.setTextDirection(props.rtl ? "rtl" : "ltr");
  },
);

onUnmounted(() => {
  textAnnotation?.destroy();
});
</script>
