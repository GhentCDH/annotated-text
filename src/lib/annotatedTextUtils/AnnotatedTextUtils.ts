import type { AnnotatedLine, Annotation, LinePart } from "@/types";
import { AnnotatedTextProps, AnnotationActionState } from "@/types";
import { Ref } from "vue";
import { computed } from "vue-demi";

export const startsOnLine = function (
  line: AnnotatedLine,
  annotation: Annotation
): Boolean {
  return line.start <= annotation.start && line.end >= annotation.start;
};

export const endsOnLine = function (
  line: AnnotatedLine,
  annotation: Annotation
): Boolean {
  return line.start <= annotation.end && line.end >= annotation.end;
};

export class CssClassesUtil {
  props: AnnotatedTextProps;
  state: Ref<AnnotationActionState>;

  constructor(props: AnnotatedTextProps, state: Ref<AnnotationActionState>) {
    this.props = props;
    this.state = state;
  }

  componentClasses = computed((): any[] => {
    const classes = [
      "annotated-text",
      "theme-" + this.props.theme,
      "annotated-text--render-" + this.props.render,
      this.state.value.action
        ? "action--active action--" + this.state.value.action
        : null,
      this.props.showLabels ? "annotated-text--show-labels" : null,
    ];
    return classes.filter((item) => item);
  });

  linePartClasses = (linePart: LinePart): any[] => {
    return [
      "line-part",
      "line-part--m" + this.maxAnnotationWeight(linePart.annotations),
    ];
  };

  annotationGutterClasses = (
    annotation: Annotation,
    line: AnnotatedLine
  ): string[] => {
    const classes = [
      annotation?.class ?? "",
      this.props.style.weightClass + (annotation?.weight ?? 0),
    ];
    if (startsOnLine(line, annotation)) {
      classes.push(this.props.style.startClass);
    }
    if (endsOnLine(line, annotation)) {
      classes.push(this.props.style.endClass);
    }
    return classes;
  };

  annotationClasses = (
    annotation: Annotation,
    start: number,
    end: number
  ): string[] => {
    const classes = [
      annotation?.class ?? "",
      this.props.style.weightClass + (annotation?.weight ?? 0),
    ];
    if (annotation?.start === start) {
      classes.push(this.props.style.startClass);
    }
    if (annotation?.end === end) {
      classes.push(this.props.style.endClass);
    }
    if (annotation === this.state.value.annotation) {
      classes.push(this.props.style.transitioningClass);
    }
    return classes;
  };

  private maxAnnotationWeight = function (annotations: Annotation[]) {
    return annotations.reduce(
      (ac, annotation) => Math.max(ac, Number(annotation?.weight ?? 0)),
      0
    );
  };
}
