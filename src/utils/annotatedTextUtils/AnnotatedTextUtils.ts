import { computed } from "vue";
import type { UpdateAnnotationState } from "../../state";
import type { Annotation } from "../../types/Annotation";
import type {
  AnnotatedLine,
  AnnotationStyle,
  RenderType,
  WordPart,
} from "../../types/AnnotatedText";
import { createAnnotationColor } from "../createAnnotationColor";

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

export type CssClassUtilProps = {
  theme?: string;
  /**
   * @deprecated
   */
  render?: RenderType;
  /**
   * Object to define classes for styles.
   */
  style?: AnnotationStyle;
  /**
   * Whether to show the labels
   */
  showLabels?: boolean;
  /**
   * List of annotation ID's that are selected. Those will get the "active" style class
   */
  selectedAnnotations?: string[];
  /**
   * List of annotation ID's that are hovered. Those will get the "hovered" style class.
   */
  hoveredAnnotations?: string[];
};

export class CssClassesUtil<P extends CssClassUtilProps> {
  props: P;
  editAnnotationState: UpdateAnnotationState;

  constructor(props: P, editingAnnotation: UpdateAnnotationState) {
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
      "token-segment",
      "token-segment--m" + this.maxAnnotationWeight(wordPart.annotations),
    ];
  };

  annotationGutterClasses = (
    annotation: Annotation,
    line: AnnotatedLine
  ): string[] => {
    const classes = [
      this.props.style.defaultClass,
      this.props.style.weightClass + (annotation?.weight ?? 0),
      annotation?.class ?? "",
    ];
    if (startsOnLine(line, annotation)) {
      classes.push(this.props.style.startClass);
    }
    if (endsOnLine(line, annotation)) {
      classes.push(this.props.style.endClass);
    }
    return classes;
  };

  annotationStyle = (annotation: Annotation): string[] => {
    if (!annotation.color) return [];

    const { border, background, borderActive, backgroundActive } =
      typeof annotation.color === "string"
        ? createAnnotationColor(annotation.color)
        : annotation.color;

    return [
      `--annotation-bg-color: ${background}`,
      `--annotation-border-color: ${border}`,
      `--annotation-bg-color--active: ${backgroundActive}`,
      `--annotation-border-color--active: ${borderActive}`,
    ];
  };

  annotationClasses = (
    annotation: Annotation,
    start: number,
    end: number,
    allowCreate: boolean
  ): string[] => {
    const classes = [
      this.props.style.defaultClass,
      this.props.style.weightClass + (annotation?.weight ?? 0),
      annotation?.class ?? "",
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

    if (this.props.hoveredAnnotations.includes(annotation.id)) {
      classes.push(this.props.style.hoveredClass);
    }

    if (this.props.selectedAnnotations.includes(annotation.id)) {
      classes.push(this.props.style.activeClass);
    }

    if (allowCreate) {
      classes.push("create-anno-text");
    }

    if (annotation.color) {
      classes.push("annotation--color-custom");
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
