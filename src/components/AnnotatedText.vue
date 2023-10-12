<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div v-if="annotatedLines" class="annotated-text">
    <div v-for="line in annotatedLines" class="line">
      <div v-if="line?.gutter" class="gutter">
        <span class="text">{{ line?.gutter?.text }}</span>
        <span class="annotations">
          <span
            v-for="annotation in line.gutter.annotations"
            :class="annotation.classes"
            @click="onClickAnnotation(annotation)"
          ></span>
        </span>
      </div>
      <div class="content">
        <span v-for="linePart in line.parts" class="line-part">
          <!-- <span>{{ linePart.text }}</span>

                    <span v-for="annotation in linePart.annotations" 
                        :class="annotationClasses(annotation, linePart.start, linePart.end)"
                        >
                        <label v-if="annotation.label">{{ annotation.label }}</label>
                    </span> -->

          <span
            v-if="linePart.annotations.length"
            :key="linePart.start"
            class="annotations--nested"
          >
            <RecursiveAnnotatedTokenPartText
              :text="linePart.text"
              :start="linePart.start"
              :end="linePart.end"
              :annotations="
                linePart.annotations.sort((a, b) => b.weight - a.weight)
              "
              :annotation-class-handler="annotationClasses"
              :annotation-click-handler="onClickAnnotation"
            />
          </span>
          <template v-else>{{ linePart.text }}</template>
        </span>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, computed } from "vue";
import type {
  AnnotatedTextProps,
  Line,
  Annotation,
  AnnotatedLine,
  LinePart,
  RangeWithAnnotation,
  RangeWithAnnotations,
} from "@/types";
import { FlattenRanges } from "etali";
import RecursiveAnnotatedTokenPartText from "./RecursiveAnnotatedTokenPartText.vue";

// props
const props = withDefaults(defineProps<AnnotatedTextProps>(), {
  annotations: [] satisfies Annotation[],
  lines: [] satisfies Line[],
  annotationOffset: 0,
  debug: false,
});

const annotationEndOffsetFix = 1;

// prepare annotations for Etali.FlattenRanges
// etali end position = position of next char not included in range
// ex: in "abcdef", span [0,2] is "ab"
const prepareRanges = (annotations: Annotation[]): RangeWithAnnotation[] => {
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

const flattenedRanges = computed((): RangeWithAnnotations[] => {
  // prepare annotations
  let ranges = prepareRanges(props.annotations);

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
  let gutterAnnotations = [];

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
      .forEach((annotation) => gutterAnnotations.push(annotation));
  }
  gutterAnnotations = [...new Set(gutterAnnotations)];

  // sort the annotations in each range by their start position
  rangesInScope = rangesInScope.map(function (range) {
    range[2] = range[2]
      .filter((annotation) => annotation)
      // .filter((annotation) => annotation?.target === "span")
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
      annotations: gutterAnnotations,
    },
  } satisfies AnnotatedLine;
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

  //min ends before max starts -> no intersection
  if (min[1] < max[0]) return null; //the ranges don't intersect

  return [max[0], min[1] < max[1] ? min[1] : max[1]];
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

const onClickAnnotation = function (annotation) {
  console.log("** clicked **");
  console.log(annotation);
};
</script>
