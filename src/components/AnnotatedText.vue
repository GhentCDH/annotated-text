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
          v-for="linePart in line.parts"
          :class="linePartClasses(linePart)"
          :data-start="linePart.start"
          :data-end="linePart.end"
          @mousemove="onMouseEnterLinePartHandler(linePart)($event)"
        >
          <template v-if="renderFlat">
            <span class="text">{{ linePart.text }}</span>
            <span
              v-for="annotation in linePart.annotations"
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
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed, defineEmits, reactive, set, ref, watch } from "vue-demi";
import type {
  AnnotatedLine,
  AnnotatedTextProps,
  Annotation,
  AnnotationLayer,
  AnnotationTarget,
  AnnotationStyle,
  AnnotationActionPayload,
  AnnotationActionState,
  Line,
  LinePart,
  RangeWithAnnotation,
  RangeWithAnnotations,
  ExtendedAnnotation,
} from "@/types";
import { FlattenRanges } from "etali";
import RecursiveAnnotatedTokenPartText from "./RecursiveAnnotatedTokenPartText.vue";
import { caretPositionFromPoint } from "@/lib/DomUtils";

// define emits
const emit = defineEmits<{
  "annotation-select": [annotation: Annotation];
  "annotation-moved": [annotation: Annotation, state: AnnotationActionState];
}>();

// init props
const props = withDefaults(defineProps<AnnotatedTextProps>(), {
  annotations: () => [],
  annotationLayers: () => [],
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

const annotationEndOffsetFix = 1;

const AnnotationLayerDefaults = {
  weight: null,
  visible: true,
  allowEdit: null,
  allowDelete: null,
  allowCreate: null,
};

const layers = computed((): AnnotationLayer[] => {
  props.debug && console.log("** refresh layers");

  return props.annotationLayers.map(
    (layer) =>
      ({
        AnnotationLayerDefaults,
        ...layer,
      } as AnnotationLayer)
  );
});

const ExtendedAnnotationDefaults = {
  layer: null,
  weight: null,
  visible: true,
  active: false,
};

const allAnnotations = computed((): ExtendedAnnotation[] => {
  props.debug && console.log("** refresh annotations");

  // upgrade annotations
  let annotations: ExtendedAnnotation[];
  annotations = props.annotations.map(
    (annotation) =>
      ({
        ...ExtendedAnnotationDefaults,
        ...annotation,
      } as ExtendedAnnotation)
  );

  // flatten annotations in layers &
  // add reference to annotation layer
  layers.value.forEach((layer) => {
    if (layer.visible) {
      let layerAnnotations = layer.annotations.map(
        (annotation) =>
          ({
            ...ExtendedAnnotationDefaults,
            layer: layer,
            ...annotation,
          } as ExtendedAnnotation)
      );
      annotations = annotations.concat(layerAnnotations);
    }
  });

  // make sure computed sees dependent state properties
  // if not, first execution won't see them because of conditional
  state.value.newStart;
  state.value.newEnd;

  // replace objects by proxies, needed to be able
  // to compare annotation (no proxy) with annotation in state (proxy)
  // annotations = reactive(annotations);

  // hide invisible annotations
  annotations = annotations.filter(
    (annotation) => annotation?.visible !== false
  );

  // update annotation state
  annotations = annotations.map((annotation) => {
    if(changes.value?.[annotation.id]) {
      annotation.start = changes.value?.[annotation.id].start;
      annotation.end = changes.value?.[annotation.id].end;
    }
    return annotation;
  });

  return annotations;
});

const gutterAnnotations = computed((): ExtendedAnnotation[] => {
  props.debug && console.log("** refresh gutterAnnotations **");
  const gutterAnnotations = allAnnotations.value.filter(
    (annotation) => annotation.target === "gutter"
  );

  props.debug && console.log(gutterAnnotations);

  return gutterAnnotations;
});

// prepare annotations for Etali.FlattenRanges
// etali end position = position of next char not included in range
// ex: in "abcdef", span [0,2] is "ab"
const prepareRanges = (
  annotations: ExtendedAnnotation[]
): RangeWithAnnotation[] => {
  props.debug && console.log("** prepare ranges for_annotations **");
  props.debug && console.log(annotations);

  let spanAnnotations = annotations.filter(
    (annotation) => annotation.target === "span"
  );

  if (props.autoAnnotationWeights) {
    calculateAnnotationWeights(spanAnnotations);
    calculateGutterAnnotationWeights(gutterAnnotations.value);
  }

  props.debug && console.log("** weighted span annotations **");
  props.debug && console.log(spanAnnotations);

  props.debug && console.log("** weighted gutter annotations **");
  props.debug && console.log(gutterAnnotations.value);

  // todo: check why max is needed
  let ranges = annotations.map(
    (annotation) =>
      [
        Math.max(0, annotation.start - props.annotationOffset),
        annotation.end + annotationEndOffsetFix - props.annotationOffset,
        annotation,
      ] satisfies RangeWithAnnotation
  );

  return ranges;
};

// flatten overlapping ranges
const flattenedRanges = computed((): RangeWithAnnotations[] => {
  // prepare annotations

  let ranges = prepareRanges(allAnnotations.value);

  // add line ranges
  props.lines.forEach((line) =>
    ranges.push([line.start, line.end + 1, null] satisfies RangeWithAnnotation)
  );

  // todo: add token ranges?
  ranges = ranges.sort((a, b) =>
    Number(a[0]) - Number(b[0]) === 0
      ? Number(a[1]) - Number(b[1])
      : Number(a[0]) - Number(b[0])
  );

  props.debug && console.log("** ranges **");
  props.debug && console.log(ranges);

  // flatten ranges
  let flattenedRanges = FlattenRanges(ranges);
  props.debug && console.log("** flattened ranges **");
  props.debug && console.log(flattenedRanges);
  return flattenedRanges;
});

const createAnnotatedLine = function (line: Line): AnnotatedLine {
  let lineGutterAnnotations = [];

  // get all flattened ranges for this line
  let rangesInScope: RangeWithAnnotations[] = flattenedRanges.value.filter(
    (range: RangeWithAnnotations) =>
      intersectInterval([range[0], range[1] - 1], [line.start, line.end])
  );

  // get gutter annotations for this line
  for (const range of rangesInScope) {
    range[2]
      .filter((annotation) => annotation)
      .filter((annotation) => annotation?.target === "gutter")
      .sort((a, b) => (Number(a?.weight) < Number(b?.weight) ? -1 : 1))
      .forEach((annotation) => lineGutterAnnotations.push(annotation));
  }

  //make sure each weight has an annotation associated with it,
  //if not add an empty annotation with the missing weight
  lineGutterAnnotations = [...new Set(lineGutterAnnotations)];

  const maxGutterWeight = Math.max(
    ...gutterAnnotations.value.map((e) => e.weight)
  );

  for (let w = 0; w <= maxGutterWeight; w++) {
    let hasAnnotationForWeight =
      lineGutterAnnotations.filter((a) => a.weight === w).length != 0;
    if (!hasAnnotationForWeight) {
      const emptyAnnotation = {
        start: line.start,
        end: line.start,
        target: "gutter" as AnnotationTarget,
        class: "annotation annotation--gutter-spacer",
        weight: w,
      } as Annotation;
      lineGutterAnnotations.push(emptyAnnotation);
    }
  }

  lineGutterAnnotations.sort((a, b) =>
    Number(a?.weight) < Number(b?.weight) ? -1 : 1
  );

  // sort the annotations in each range by their start position
  rangesInScope = rangesInScope.map(function (range) {
    range[2] = range[2]
      .filter((annotation) => annotation)
      .filter((annotation) => annotation?.target === "span")
      .sort((a, b) => (Number(a?.start) > Number(b?.start) ? 1 : -1));
    return range;
  });

  props.debug && console.log("** ranges in scope **");
  props.debug && console.log(rangesInScope);

  let lineParts: LinePart[] = rangesInScope.map(function (
    range: RangeWithAnnotations
  ) {
    return {
      start: range[0],
      end: range[1] - 1,
      text: line.text.substring(range[0] - line.start, range[1] - line.start),
      annotations: range[2],
    } satisfies LinePart;
  });

  return {
    start: line.start,
    end: line.end,
    parts: lineParts,
    gutter: {
      text: line.gutter,
      annotations: lineGutterAnnotations,
    },
  } satisfies AnnotatedLine;
};

const startsOnLine = function (
  line: AnnotatedLine,
  annotation: Annotation
): Boolean {
  return line.start <= annotation.start && line.end >= annotation.start;
};

const endsOnLine = function (
  line: AnnotatedLine,
  annotation: Annotation
): Boolean {
  return line.start <= annotation.end && line.end >= annotation.end;
};

const annotatedLines = computed((): AnnotatedLine[] => {
  let lines = props.lines.map((line) => createAnnotatedLine(line));
  props.debug && console.log("** annotated lines **");
  props.debug && console.log(lines);
  return lines;
});

// caculate interval intersection
const intersectInterval = (
  a: [number, number],
  b: [number, number]
): [number, number] | null => {
  const min = a[0] < b[0] ? a : b;
  const max = min == a ? b : a;

  //console.log("min max intesection",min,max,min[1] < max[0])
  //min ends before max starts -> no intersection
  if (min[1] < max[0]) return null; //the ranges don't intersect

  return [max[0], min[1] < max[1] ? min[1] : max[1]];
};

const calculateAnnotationWeights = function (annotations: Annotation[]) {
  const compareAnnotations = function (a: Annotation, b: Annotation): number {
    return a.start - b.start === 0 ? b.end - a.end : a.start - b.start;
  };

  annotations = annotations.sort(compareAnnotations);

  const stack = [];
  annotations.forEach(function (annotation) {
    let weight = 0;
    for (;;) {
      if (!stack?.[weight]) {
        annotation.weight = weight;
        stack[weight] = annotation;
        return;
      }
      if (annotation.start > stack[weight].end) {
        annotation.weight = weight;
        stack[weight] = annotation;
        return;
      }
      weight++;
    }
  });
};

const calculateGutterAnnotationWeights = function (annotations: Annotation[]) {
  //this function is similar to the weights for span annotations but there is one difference
  //two annotations can start on the same line and 'overlap' even if they are not overlapping based on
  //character indexes.
  const compareAnnotations = function (a: Annotation, b: Annotation): number {
    let aLength = a.end - a.start;
    let bLength = b.end - b.start;
    return aLength - bLength;
  };

  annotations = annotations.sort(compareAnnotations);

  let weight = 0;
  annotations.forEach(function (annotation) {
    annotation.weight = weight;
    weight++;
  });

  //reverse weights, makes sure longest is at the right, not left (close to the text)
  const maxGutterWeight = Math.max(
    ...gutterAnnotations.value.map((e) => e.weight)
  );
  annotations.forEach(function (annotation) {
    annotation.weight = maxGutterWeight - annotation.weight;
  });
};

const annotationGutterClasses = function (
  annotation: Annotation,
  line: AnnotatedLine
): string[] {
  let classes = [
    annotation?.class ?? "",
    props.style.weightClass + (annotation?.weight ?? 0),
  ];
  if (startsOnLine(line, annotation)) {
    classes.push(props.style.startClass);
  }
  if (endsOnLine(line, annotation)) {
    classes.push(props.style.endClass);
  }
  return classes;
};

const annotationClasses = function (
  annotation: Annotation,
  start: number,
  end: number
): string[] {
  let classes = [
    annotation?.class ?? "",
    props.style.weightClass + (annotation?.weight ?? 0),
  ];
  if (annotation?.start === start) {
    classes.push(props.style.startClass);
  }
  if (annotation?.end === end) {
    classes.push(props.style.endClass);
  }
  if (annotation === state.value.annotation) {
    classes.push(props.style.transitioningClass);
  }
  return classes;
};

const onClickAnnotation = function (annotation: Annotation) {
  emit("click-annotation", annotation);
  console.log("emit click-annotation");
};

const renderNested = computed(() => props.render === "nested");
const renderFlat = computed(() => props.render === "flat");

const componentClasses = computed((): any[] => {
  let classes = [
    "annotated-text",
    "theme-" + props.theme,
    "annotated-text--render-" + props.render,
    state.value.action ? "action--active action--" + state.value.action : null,
    props.showLabels ? "annotated-text--show-labels" : null,
  ];
  return classes.filter((item) => item);
});

const linePartClasses = function (linePart: LinePart): any[] {
  let classes = [
    "line-part",
    "line-part--m" + maxAnnotationWeight(linePart.annotations),
  ];
  return classes;
};

const maxAnnotationWeight = function (annotations: Annotation[]) {
  return annotations.reduce(
    (ac, annotation) => Math.max(ac, Number(annotation?.weight ?? 0)),
    0
  );
};

// state & changes
let state = ref<AnnotationAction>(initActionState());
let changes = ref({});

// clear changes on prop update 
// (parent had the change to listen to events)
watch(
  () => props,
  (_newValue, _oldValue) => {
    changes.value = {};
});

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

function onMouseLeaveHandler(MouseEvent: e) {
  // reset state?
  if (state.value.action) {
    state.value = initActionState();
  }
  console.log("global mouseleave");
}

function onMouseUpHandler(MouseEvent: e) {
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
  MouseEvent: e,
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
        switch (state.value.action) {
          case "moveEnd":
            if (newPosition >= state.value.annotation.start) {
              state.value.newEnd = newPosition;
              changes.value[state.value.annotation.id] = { start: state.value.newStart, end: state.value.newEnd };
            }
            break;
          case "moveStart":
            if (newPosition <= state.value.annotation.end) {
              state.value.newStart = newPosition;
              changes.value[state.value.annotation.id] = { start: state.value.newStart, end: state.value.newEnd };
            }
            break;
          case "move":
            const offset = newPosition - state.value.handlePosition;
            state.value.newStart = state.value.origStart + offset;
            state.value.newEnd = state.value.origEnd + offset;
            changes.value[state.value.annotation.id] = { start: state.value.newStart, end: state.value.newEnd };
            break;
        }
      }
    }
  };
};
</script>
