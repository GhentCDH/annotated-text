<template>
  <div v-if="annotatedLines" :class="componentClasses">
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
            />
            <span v-else class="text">{{ linePart.text }}</span>
          </template>
        </span>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed, defineEmits, reactive } from "vue-demi";
import type {
  AnnotatedLine,
  AnnotatedTextProps,
  Annotation,
  AnnotationTarget,
  Line,
  LinePart,
  RangeWithAnnotation,
  RangeWithAnnotations,
} from "@/types";
import { FlattenRanges } from "etali";
import RecursiveAnnotatedTokenPartText from "./RecursiveAnnotatedTokenPartText.vue";

// define emits
const emit = defineEmits<{
  "click-annotation": [annotation: Annotation];
}>();

// init props
const props = withDefaults(defineProps<AnnotatedTextProps>(), {
  annotations: [] satisfies Annotation[],
  lines: [] satisfies Line[],
  annotationOffset: 0,
  debug: true,
  theme: "default",
  render: "nested",
  showLabels: false,
  autoAnnotationWeights: true,
});

const annotationEndOffsetFix = 1;
const annotations = reactive(props.annotations) satisfies Annotation[];

// prepare annotations for Etali.FlattenRanges
// etali end position = position of next char not included in range
// ex: in "abcdef", span [0,2] is "ab"
const prepareRanges = (annotations: Annotation[]): RangeWithAnnotation[] => {
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

const gutterAnnotations = computed((): Annotation[] => {
  const gutter_annotations = annotations.filter(
    (annotation) => annotation.target === "gutter"
  ) as Annotation[];

  props.debug && console.log("** gutter_annotations **");
  props.debug && console.log(gutter_annotations);

  return gutter_annotations;
});

// flatten overlapping ranges
const flattenedRanges = computed((): RangeWithAnnotations[] => {
  // prepare annotations

  let ranges = prepareRanges(annotations);

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

/**
 * Find the character index for the start of the first line or end of the last matching line.
 * @param annotation The annotation to look for
 * @param lookForStartCharIndex If true finds the start character index of the first line. If false returns the end character index of the last matching line.
 */
const findLineStartOrEndCharacterIndex = function (
  annotation: Annotation,
  lookForStartCharIndex: boolean
) {
  let characterIndex = -1;

  props.lines.forEach((line) => {
    let gutterTextLength = 0;
    if (line.gutter) gutterTextLength = line.gutter.length;

    if (
      line.start - gutterTextLength <= annotation.start &&
      annotation.start <= line.end &&
      lookForStartCharIndex
    ) {
      characterIndex = line.start - gutterTextLength;

      console.log(line, annotation);
      return;
    } else if (
      line.start - gutterTextLength <= annotation.end &&
      annotation.end <= line.end &&
      !lookForStartCharIndex
    ) {
      characterIndex = line.end;
    }
  });

  console.log(
    characterIndex,
    "from",
    annotation.start,
    annotation.end,
    lookForStartCharIndex
  );
  return characterIndex;
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
    "annotation--w" + (annotation?.weight ?? 0),
  ];
  if (startsOnLine(line, annotation)) {
    classes.push("annotation--start");
  }
  if (endsOnLine(line, annotation)) {
    classes.push("annotation--end");
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
    "annotation--w" + (annotation?.weight ?? 0),
  ];
  if (annotation?.start === start) {
    classes.push("annotation--start");
  }
  if (annotation?.end === end) {
    classes.push("annotation--end");
  }
  return classes;
};

const onClickAnnotation = function (annotation: Annotation) {
  emit("click-annotation", annotation);
};

const renderNested = computed(() => props.render === "nested");
const renderFlat = computed(() => props.render === "flat");
const componentClasses = computed((): any[] => {
  let classes = [
    "annotated-text",
    "theme-" + props.theme,
    "annotated-text--render-" + props.render,
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
</script>
