import {
  type AnnotatedLine,
  AnnotatedTextProps,
  type Annotation,
  AnnotationActionState,
  type AnnotationLayer, type AnnotationTarget, type Line, type LinePart,
  RangeWithAnnotation, RangeWithAnnotations
} from "@/types";
import { computed } from "vue-demi";
import { Ref } from "vue";
import { FlattenRanges } from "etali";

// Some consts needed for the utils class
const AnnotationLayerDefaults = {
  weight: null,
  visible: true,
  allowEdit: null,
  allowDelete: null,
  allowCreate: null,
};

const ExtendedAnnotationDefaults = {
  layer: null,
  weight: null,
  visible: true,
  active: false,
};

const annotationEndOffsetFix = 1;

// caculate interval of an intersection
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

// Utils class containing logic needed in the AnnotatedText component
export default class AnnotatedTextUtils {
  props: AnnotatedTextProps;
  state: Ref<AnnotationActionState>;
  changes: Ref<{}>;

  constructor(
    props: AnnotatedTextProps,
    state: Ref<AnnotationActionState>,
    changes: Ref<{}>
  ) {
    this.props = props;
    this.state = state;
    this.changes = changes;
  }

  private layers = computed((): AnnotationLayer[] => {
    this.props.debug && console.log("** refresh layers");
    console.log(this.props.annotationLayers);

    return this.props.annotationLayers.map(
      (layer) =>
        ({
          AnnotationLayerDefaults,
          ...layer,
        } as AnnotationLayer)
    );
  });

  private allAnnotations = computed((): Annotation[] => {
    this.props.debug && console.log("** refresh annotations");

    // // upgrade annotations
    // let annotations: ExtendedAnnotation[];
    // annotations = this.props.annotations.map(
    //   (annotation) =>
    //     ({
    //       ...ExtendedAnnotationDefaults,
    //       ...annotation,
    //     } as ExtendedAnnotation)
    // );
    let annotations = this.props.annotations;

    // flatten annotations in layers &
    // add reference to annotation layer
    this.layers.value.forEach((layer) => {
      if (layer.visible) {
        const layerAnnotations = layer.annotations.map(
          (annotation) =>
            ({
              ...ExtendedAnnotationDefaults,
              layer: layer,
              ...annotation,
            } as Annotation)
        );
        annotations = annotations.concat(layerAnnotations);
      }
    });

    // make sure computed sees dependent this.state properties
    // if not, first execution won't see them because of conditional
    this.state.value.newStart;
    this.state.value.newEnd;

    // replace objects by proxies, needed to be able
    // to compare annotation (no proxy) with annotation in this.state (proxy)
    // annotations = reactive(annotations);

    // hide invisible annotations
    annotations = annotations.filter(
      (annotation) => annotation?.visible !== false
    );

    // update annotation this.state
    annotations = annotations.map((annotation) => {
      if (this.changes.value?.[annotation.id]) {
        annotation.start = this.changes.value?.[annotation.id].start;
        annotation.end = this.changes.value?.[annotation.id].end;
      }
      return annotation;
    });

    return annotations;
  });

  private gutterAnnotations = computed((): Annotation[] => {
    this.props.debug && console.log("** refresh gutterAnnotations **");
    const gutterAnnotations = this.allAnnotations.value.filter(
      (annotation) => annotation.target === "gutter"
    );

    this.props.debug && console.log(gutterAnnotations);

    return gutterAnnotations;
  });

  // prepare annotations for Etali.FlattenRanges
  // etali end position = position of next char not included in range
  // ex: in "abcdef", span [0,2] is "ab"
  private prepareRanges = (
    annotations: Annotation[]
  ): RangeWithAnnotation[] => {
    this.props.debug && console.log("** prepare ranges for_annotations **");
    this.props.debug && console.log(annotations);

    const spanAnnotations = annotations.filter(
      (annotation) => annotation.target === "span"
    );

    if (this.props.autoAnnotationWeights) {
      this.calculateAnnotationWeights(spanAnnotations);
      this.calculateGutterAnnotationWeights(this.gutterAnnotations.value);
    }

    this.props.debug && console.log("** weighted span annotations **");
    this.props.debug && console.log(spanAnnotations);

    this.props.debug && console.log("** weighted gutter annotations **");
    this.props.debug && console.log(this.gutterAnnotations.value);

    // todo: check why max is needed
    return annotations.map(
      (annotation) =>
        [
          Math.max(0, annotation.start - this.props.annotationOffset),
          annotation.end + annotationEndOffsetFix - this.props.annotationOffset,
          annotation,
        ] satisfies RangeWithAnnotation
    );
  };

  private calculateAnnotationWeights = function (annotations: Annotation[]) {
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

  private calculateGutterAnnotationWeights = function (annotations: Annotation[]) {
    //this function is similar to the weights for span annotations but there is one difference
    //two annotations can start on the same line and 'overlap' even if they are not overlapping based on
    //character indexes.
    const compareAnnotations = function (a: Annotation, b: Annotation): number {
      const aLength = a.end - a.start;
      const bLength = b.end - b.start;
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
      ...this.gutterAnnotations.value.map((e) => e.weight)
    );
    annotations.forEach(function (annotation) {
      annotation.weight = maxGutterWeight - annotation.weight;
    });
  };

  // flatten overlapping ranges
  private flattenedRanges = computed((): RangeWithAnnotations[] => {
    // prepare annotations

    let ranges = this.prepareRanges(this.allAnnotations.value);

    // add line ranges
    this.props.lines.forEach((line) =>
      ranges.push([line.start, line.end + 1, null] satisfies RangeWithAnnotation)
    );

    // todo: add token ranges?
    ranges = ranges.sort((a, b) =>
      Number(a[0]) - Number(b[0]) === 0
        ? Number(a[1]) - Number(b[1])
        : Number(a[0]) - Number(b[0])
    );

    this.props.debug && console.log("** ranges **");
    this.props.debug && console.log(ranges);

    // flatten ranges
    const flattenedRanges = FlattenRanges(ranges);
    this.props.debug && console.log("** flattened ranges **");
    this.props.debug && console.log(flattenedRanges);
    return flattenedRanges;
  });

  private createAnnotatedLine = (line: Line): AnnotatedLine => {
    let lineGutterAnnotations = [];

    // get all flattened ranges for this line
    let rangesInScope: RangeWithAnnotations[] =
      this.flattenedRanges.value.filter((range: RangeWithAnnotations) =>
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
      ...this.gutterAnnotations.value.map((e) => e.weight)
    );

    for (let w = 0; w <= maxGutterWeight; w++) {
      const hasAnnotationForWeight =
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

    this.props.debug && console.log("** ranges in scope **");
    this.props.debug && console.log(rangesInScope);

    const lineParts: LinePart[] = rangesInScope.map(function (
      range: RangeWithAnnotations
    ) {
      return {
        start: range[0],
        end: range[1] - 1,
        text:
          typeof line.text === "string"
            ? line.text.substring(range[0] - line.start, range[1] - line.start)
            : "",
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

  /**
   * Map every line to an annotated line
   */
  annotatedLines = computed((): AnnotatedLine[] => {
    const lines = this.props.lines.map((line) => this.createAnnotatedLine(line));
    this.props.debug && console.log("** annotated lines **");
    this.props.debug && console.log(lines);
    return lines;
  });
}
