import type {
  AnnotatedLine,
  AnnotatedTextProps,
  Annotation,
  WordPart,
} from "@/types";
import { computed } from "vue-demi";
import { UpdateAnnotationState } from "@/lib/annotatedTextUtils/StateClasses";

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
  editAnnotationState: UpdateAnnotationState;

  constructor(
    props: AnnotatedTextProps,
    editingAnnotation: UpdateAnnotationState
  ) {
    this.props = props;
    this.editAnnotationState = editingAnnotation;
  }

  componentClasses = computed((): any[] => {
    const classes = [
      "annotated-text",
      "theme-" + this.props.theme,
      "annotated-text--render-" + this.props.render,
      this.editAnnotationState.action
        ? "action--active action--" + this.editAnnotationState.action
        : null,
      this.props.showLabels ? "annotated-text--show-labels" : null,
    ];
    return classes.filter((item) => item);
  });

  wordPartClasses = (wordPart: WordPart): string[] => {
    return [
      "line-part",
      "line-part--m" + this.maxAnnotationWeight(wordPart.annotations),
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
    end: number,
    allowCreate: boolean
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
    if (
      this.editAnnotationState.annotation &&
      annotation.id === this.editAnnotationState.annotation.id &&
      annotation !== this.editAnnotationState.annotation
    ) {
      classes.push(this.props.style.transitioningClass);
    }
    if (
      this.editAnnotationState.annotation &&
      annotation === this.editAnnotationState.annotation
    ) {
      classes.push(this.props.style.shadowClass);
    }

    if (allowCreate) {
      classes.push("create-anno-text");
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
